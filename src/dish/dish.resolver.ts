import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Roles } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { DishService } from './dish.service';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { FindDishInput, FindDishOutput } from './dtos/find-dish.dto';
import { GetDishesInput, GetDishesOutput } from './dtos/get-dishes.dto';
import { Dish } from './entities/dish.entity';

@Resolver((of) => Dish)
export class DishResolver {
  constructor(private readonly dishService: DishService) {}

  @Mutation((returns) => CreateDishOutput)
  @Roles(['Owner'])
  async createDish(
    @AuthUser() owner: User,
    @Args('input') createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.dishService.createDish(owner, createDishInput);
  }

  @Query((returns) => FindDishOutput)
  @Roles(['Any'])
  async findDish(
    @Args('input') findDishInput: FindDishInput,
  ): Promise<FindDishOutput> {
    return this.dishService.findDish(findDishInput);
  }

  @Query((returns) => GetDishesOutput)
  @Roles(['Any'])
  async getDishes(
    @Args('input') getDishesInput: GetDishesInput,
  ): Promise<GetDishesOutput> {
    return this.dishService.getDishes(getDishesInput);
  }

  // get, edit, delete
}
