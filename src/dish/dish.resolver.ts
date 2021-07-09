import { Resolver } from '@nestjs/graphql';
import { DishService } from './dish.service';
import { Dish } from './entities/dish.entity';

@Resolver((of) => Dish)
export class DishResolver {
  constructor(private readonly dishService: DishService) {}
}
