import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { DishResolver } from '@apis/dishes/dish.resolver';
import { DishService } from '@apis/dishes/dish.service';
import { Dish } from '@apis/dishes/entities/dish.entity';
import { RestaurantService } from '../restaurants/restaurants.service';
import { CategoryRepository } from '../restaurants/repositories/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, Restaurant, CategoryRepository])],
  providers: [DishResolver, DishService, RestaurantService],
})
export class DishModule {}
