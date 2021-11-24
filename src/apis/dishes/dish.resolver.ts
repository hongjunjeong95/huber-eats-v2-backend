import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthUser } from '@auth/auth-user.decorator';
import { Roles } from '@auth/role.decorator';
import { User } from '@apis/users/entities/user.entity';
import { DishService } from '@apis/dishes/dish.service';
import {
  CreateDishInput,
  CreateDishOutput,
} from '@apis/dishes/dtos/create-dish.dto';
import {
  DeleteDishInput,
  DeleteDishOutput,
} from '@apis/dishes/dtos/delete-dish.dto';
import { FindDishInput, FindDishOutput } from '@apis/dishes/dtos/find-dish.dto';
import {
  GetDishesInput,
  GetDishesOutput,
} from '@apis/dishes/dtos/get-dishes.dto';
import {
  UpdateDishInput,
  UpdateDishOutput,
} from '@apis/dishes/dtos/update-dish.dto';
import { Dish } from '@apis/dishes/entities/dish.entity';

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

  @Mutation((returns) => UpdateDishOutput)
  @Roles(['Owner'])
  async updateDish(
    @AuthUser() owner: User,
    @Args('input') updateDishInput: UpdateDishInput,
  ): Promise<UpdateDishOutput> {
    return this.dishService.updateDish(owner, updateDishInput);
  }

  @Mutation((returns) => DeleteDishOutput)
  @Roles(['Owner'])
  async deleteDish(
    @AuthUser() owner: User,
    @Args('input') deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    return this.dishService.deleteDish(owner, deleteDishInput);
  }
}
