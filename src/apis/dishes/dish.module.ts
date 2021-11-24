import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { DishResolver } from '@apis/dishes/dish.resolver';
import { DishService } from '@apis/dishes/dish.service';
import { Dish } from '@apis/dishes/entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, Restaurant])],
  providers: [DishResolver, DishService],
})
export class DishModule {}
