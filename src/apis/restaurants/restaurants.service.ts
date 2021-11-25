import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, ObjectLiteral, Raw, Repository } from 'typeorm';

import { User } from '@apis/users/entities/user.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from '@apis/restaurants/dtos/create-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from '@apis/restaurants/dtos/delete-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from '@apis/restaurants/dtos/edit-restaurant.dto';
import {
  GetRestaurantsInput,
  GetRestaurantsOutput,
} from '@src/apis/restaurants/dtos/get-restaurants.dto';
import {
  FindRestaurantByIdInput,
  FindRestaurantByIdOutput,
} from '@apis/restaurants/dtos/find-restaurant.dto';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { CategoryRepository } from '@apis/restaurants/repositories/category.repository';
import { Category } from '@apis/categories/entities/category.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,

    private readonly categories: CategoryRepository,
  ) {}

  // Service for ResolveFields
  async getRestaurantsByWhere({
    where,
  }: {
    where?:
      | FindConditions<Restaurant>[]
      | FindConditions<Restaurant>
      | ObjectLiteral
      | string;
  }) {
    return this.restaurants.find({
      where,
    });
  }

  async findRestaurantByIdForManyToOne({
    table,
    id,
  }: {
    table: string;
    id: number;
  }) {
    return this.restaurants
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect(
        table === 'dish' ? `restaurant.${table}es` : `restaurant.${table}s`,
        table,
      )
      .where(`${table}.id = :id`, { id })
      .getOne();
  }

  // Resolvers
  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = await this.restaurants.create(
        createRestaurantInput,
      );
      newRestaurant.owner = owner;
      newRestaurant.category = await this.categories.getOrCreate(
        createRestaurantInput.categoryName,
      );

      const restaurant = await this.restaurants.save(newRestaurant);

      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }

  async getRestaurants(
    { page, slug, query }: GetRestaurantsInput,
    owner?: User,
  ): Promise<GetRestaurantsOutput> {
    let category = null;

    if (slug) {
      await this.categories.findOne({ slug });
      if (!category) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Category not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const takePages = 3;
    const [restaurants, totalRestaurants] = await this.restaurants.findAndCount(
      {
        where: {
          ...owner,
          ...category,
          ...(query
            ? { name: Raw((name) => `${name} ILIKE '%${query}%'`) }
            : {}),
        },
        skip: (page - 1) * takePages,
        take: takePages,
        order: {
          createdAt: 'DESC',
        },
      },
    );
    return {
      ok: true,
      restaurants,
      totalPages: Math.ceil(totalRestaurants / takePages),
      totalResults: totalRestaurants,
    };
  }

  async findRestaurantById({
    id,
  }: FindRestaurantByIdInput): Promise<FindRestaurantByIdOutput> {
    const restaurant = await this.restaurants.findOne({ id });

    if (!restaurant) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Restaurant not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      ok: true,
      restaurant,
    };
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: {
          owner,
          id: editRestaurantInput.restaurantId,
        },
        relations: ['category'],
      });

      if (!restaurant) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Restaurant not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreate(
          editRestaurantInput.categoryName,
        );
      }

      await this.restaurants.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);

      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not update restaurants',
      };
    }
  }

  async deleteRestaurant(
    owner: User,
    { id }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        owner,
        id,
      });

      if (!restaurant) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Restaurant not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.restaurants.delete(id);

      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not delete restaurants',
      };
    }
  }
}
