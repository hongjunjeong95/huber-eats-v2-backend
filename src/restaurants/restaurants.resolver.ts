import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Roles } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { GetMyRestaurantsOutput } from './dtos/get-my-restaurants.dto';
import {
  GetAllRestaurantsInput,
  GetAllRestaurantsOutput,
} from './dtos/get-all-restaurants.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
import {
  GetMyRestaurantInput,
  GetMyRestaurantOutput,
} from './dtos/get-my-restaurant.dto';
import {
  GetRestaurantInput,
  GetRestaurantOutput,
} from './dtos/get-restaurant.dto';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query((type) => Boolean)
  sayHello() {
    return true;
  }

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

  @Query((type) => GetMyRestaurantsOutput)
  @Roles(['Owner'])
  async getMyRestaurants(
    @AuthUser() owner: User,
  ): Promise<GetMyRestaurantsOutput> {
    return this.restaurantService.getMyRestaurants(owner);
  }

  @Query((type) => GetMyRestaurantOutput)
  @Roles(['Owner'])
  async findMyRestaurantById(
    @AuthUser() owner: User,
    @Args('input') myRestaurantInput: GetMyRestaurantInput,
  ): Promise<GetMyRestaurantOutput> {
    return this.restaurantService.findMyRestaurantById(
      owner,
      myRestaurantInput,
    );
  }

  @Query((type) => GetAllRestaurantsOutput)
  async getAllRestaurants(
    @Args('input') getAllRestaurantsInput: GetAllRestaurantsInput,
  ): Promise<GetAllRestaurantsOutput> {
    return this.restaurantService.getAllRestaurants(getAllRestaurantsInput);
  }

  @Query((type) => GetRestaurantOutput)
  async getRestaurant(
    @Args('input') getRestaurantInput: GetRestaurantInput,
  ): Promise<GetRestaurantOutput> {
    return this.restaurantService.findRestaurantById(getRestaurantInput);
  }

  // editRestaurant
  // deleteRestaurant
  // searchRestaurant
  // getRestaurantPosition
}
