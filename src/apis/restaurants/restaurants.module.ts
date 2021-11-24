import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Dish } from '@apis/dishes/entities/dish.entity';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { CategoryRepository } from '@apis/restaurants/repositories/category.repository';
import { RestaurantResolver } from '@apis/restaurants/restaurants.resolver';
import { RestaurantService } from '@apis/restaurants/restaurants.service';
import { DishService } from '../dishes/dish.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Dish, CategoryRepository])],
  providers: [RestaurantResolver, RestaurantService, DishService],
})
export class RestaurantsModule {}
