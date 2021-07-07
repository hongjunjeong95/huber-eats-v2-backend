import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Raw, Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import {
  GetAllRestaurantsInput,
  GetAllRestaurantsOutput,
} from './dtos/get-all-restaurants.dto';
import {
  FindMyRestaurantByIdInput,
  FindMyRestaurantByIdOutput,
} from './dtos/find-my-restaurant.dto';
import { GetMyRestaurantsOutput } from './dtos/get-my-restaurants.dto';
import {
  FindRestaurantByIdInput,
  FindRestaurantByIdOutput,
} from './dtos/find-restaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';
import {
  SearchRestaurantByNameInput,
  SearchRestaurantByNameOutput,
} from './dtos/search-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,

    @InjectRepository(Category)
    private readonly categories: CategoryRepository,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      console.log(createRestaurantInput);
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
          relations: ['category', 'owner'],
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
        owner,
        id: editRestaurantInput.restaurantId,
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
        restaurant,
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
