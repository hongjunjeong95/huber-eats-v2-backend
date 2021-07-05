import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { MyRestaurantsOutput } from './dtos/my-restaurants.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurants.entity';
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

  async myRestaurants(authUser: User): Promise<MyRestaurantsOutput> {
    try {
      const restaurants = await this.restaurants.find({ owner: authUser });
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
}
