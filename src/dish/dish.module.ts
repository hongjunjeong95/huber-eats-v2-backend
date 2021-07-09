import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishResolver } from './dish.resolver';
import { DishService } from './dish.service';
import { Dish } from './entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dish])],
  providers: [DishResolver, DishService],
})
export class DishModule {}
