import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { AuthUser } from '@auth/auth-user.decorator';
import { Roles } from '@auth/role.decorator';
import { User } from '@apis/users/entities/user.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from '@apis/restaurants/dtos/create-restaurant.dto';
import { GetMyRestaurantsOutput } from '@apis/restaurants/dtos/get-my-restaurants.dto';
import {
  GetAllRestaurantsInput,
  GetAllRestaurantsOutput,
} from '@apis/restaurants/dtos/get-all-restaurants.dto';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { RestaurantService } from '@apis/restaurants/restaurants.service';
import {
  FindMyRestaurantByIdInput,
  FindMyRestaurantByIdOutput,
} from '@apis/restaurants/dtos/find-my-restaurant.dto';
import {
  FindRestaurantByIdInput,
  FindRestaurantByIdOutput,
} from '@apis/restaurants/dtos/find-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from '@apis/restaurants/dtos/edit-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from '@apis/restaurants/dtos/delete-restaurant.dto';
import {
  SearchRestaurantByNameInput,
  SearchRestaurantByNameOutput,
} from '@apis/restaurants/dtos/search-restaurant.dto';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation((returns) => CreateRestaurantOutput)
  @Roles(['Owner'])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }

  @Query((returns) => GetMyRestaurantsOutput)
  @Roles(['Owner'])
  async getMyRestaurants(
    @AuthUser() owner: User,
  ): Promise<GetMyRestaurantsOutput> {
    return this.restaurantService.getMyRestaurants(owner);
  }

  @Query((returns) => FindMyRestaurantByIdOutput)
  @Roles(['Owner'])
  async findMyRestaurantById(
    @AuthUser() owner: User,
    @Args('input') myRestaurantInput: FindMyRestaurantByIdInput,
  ): Promise<FindMyRestaurantByIdOutput> {
    return this.restaurantService.findMyRestaurantById(
      owner,
      myRestaurantInput,
    );
  }

  @Query((returns) => GetAllRestaurantsOutput)
  async getAllRestaurants(
    @Args('input') getAllRestaurantsInput: GetAllRestaurantsInput,
  ): Promise<GetAllRestaurantsOutput> {
    return this.restaurantService.getAllRestaurants(getAllRestaurantsInput);
  }

  @Query((returns) => FindRestaurantByIdOutput)
  async findRestaurantById(
    @Args('input') getRestaurantInput: FindRestaurantByIdInput,
  ): Promise<FindRestaurantByIdOutput> {
    return this.restaurantService.findRestaurantById(getRestaurantInput);
  }

  @Mutation((returns) => EditRestaurantOutput)
  @Roles(['Owner'])
  async editRestaurant(
    @AuthUser() owner: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput);
  }

  @Mutation((returns) => DeleteRestaurantOutput)
  @Roles(['Owner'])
  async deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(
      owner,
      deleteRestaurantInput,
    );
  }

  @Query((returns) => SearchRestaurantByNameOutput)
  async searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantByNameInput,
  ): Promise<SearchRestaurantByNameOutput> {
    return this.restaurantService.searchRestaurant(searchRestaurantInput);
  }

  // getRestaurantPosition
}
