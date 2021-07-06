import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  GetAllRestaurantsInput,
  GetAllRestaurantsOutput,
} from './dtos/get-all-restaurants.dto';
import { MyRestaurantInput, MyRestaurantOutput } from './dtos/my-restaurant';
import { MyRestaurantsOutput } from './dtos/my-restaurants.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

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

  async myRestaurants(owner: User): Promise<MyRestaurantsOutput> {
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

  async myRestaurant(
    owner: User,
    { id }: MyRestaurantInput,
  ): Promise<MyRestaurantOutput> {
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
}
