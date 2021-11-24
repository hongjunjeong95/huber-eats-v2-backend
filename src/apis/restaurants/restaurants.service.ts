import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';

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
  GetAllRestaurantsInput,
  GetAllRestaurantsOutput,
} from '@apis/restaurants/dtos/get-all-restaurants.dto';
import {
  FindMyRestaurantByIdInput,
  FindMyRestaurantByIdOutput,
} from '@apis/restaurants/dtos/find-my-restaurant.dto';
import { GetMyRestaurantsOutput } from '@apis/restaurants/dtos/get-my-restaurants.dto';
import {
  FindRestaurantByIdInput,
  FindRestaurantByIdOutput,
} from '@apis/restaurants/dtos/find-restaurant.dto';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { CategoryRepository } from '@apis/restaurants/repositories/category.repository';
import {
  SearchRestaurantByNameInput,
  SearchRestaurantByNameOutput,
} from '@apis/restaurants/dtos/search-restaurant.dto';
import { Category } from '@apis/categories/entities/category.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,

    private readonly categories: CategoryRepository,
  ) {}

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

      await this.restaurants.save(newRestaurant);

      return {
        ok: true,
        restaurantId: newRestaurant.id,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }

  async getMyRestaurants(owner: User): Promise<GetMyRestaurantsOutput> {
    try {
      const restaurants = await this.restaurants.find({
        where: {
          owner,
        },
        relations: ['category', 'owner'],
      });
      return {
        ok: true,
        restaurants,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not find restaurants',
      };
    }
  }

  async findMyRestaurantById(
    owner: User,
    { id }: FindMyRestaurantByIdInput,
  ): Promise<FindMyRestaurantByIdOutput> {
    try {
      const restaurant = await this.restaurants.findOne(
        { owner, id },
        {
          relations: ['category', 'owner', 'menu'],
        },
      );

      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not find restaurants',
      };
    }
  }

  async getAllRestaurants({
    page,
  }: GetAllRestaurantsInput): Promise<GetAllRestaurantsOutput> {
    try {
      const takePages = 3;
      const [restaurants, totalRestaurants] =
        await this.restaurants.findAndCount({
          skip: (page - 1) * takePages,
          take: takePages,
          order: {
            createdAt: 'DESC',
          },
          relations: ['category'],
        });
      return {
        ok: true,
        restaurants,
        totalPages: Math.ceil(totalRestaurants / takePages),
        totalResults: totalRestaurants,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not find restaurants',
      };
    }
  }

  async findRestaurantById({
    id,
  }: FindRestaurantByIdInput): Promise<FindRestaurantByIdOutput> {
    try {
      const restaurant = await this.restaurants.findOne(
        { id },
        {
          relations: ['category', 'owner', 'menu'],
        },
      );

      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }

      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not find restaurants',
      };
    }
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
        return {
          ok: false,
          error: 'Restaurant not found',
        };
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
        return {
          ok: false,
          error: 'Restaurant not found',
        };
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

  async searchRestaurant({
    query,
    page,
  }: SearchRestaurantByNameInput): Promise<SearchRestaurantByNameOutput> {
    try {
      const takePages = 3;
      const [restaurants, totalRestaurants] =
        await this.restaurants.findAndCount({
          where: {
            name: Raw((name) => `${name} ILIKE '%${query}%'`),
          },
          skip: (page - 1) * takePages,
          take: takePages,
          order: {
            createdAt: 'DESC',
          },
        });

      return {
        ok: true,
        restaurants,
        totalPages: Math.ceil(totalRestaurants / takePages),
        totalResults: totalRestaurants,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not find restaurants',
      };
    }
  }
}
