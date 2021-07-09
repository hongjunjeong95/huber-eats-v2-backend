import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Roles } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { DishService } from './dish.service';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { Dish } from './entities/dish.entity';

@Resolver((of) => Dish)
export class DishResolver {
  constructor(private readonly dishService: DishService) {}

  @Mutation((returns) => CreateDishOutput)
  @Roles(['Owner'])
  async createDish(
    @AuthUser() owner: User,
    @Args('input') createDish: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.dishService.createDish(owner, createDish);
  }
}
