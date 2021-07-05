import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Roles } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { MyRestaurantsOutput } from './dtos/my-restaurants.dto';
import { Restaurant } from './entities/restaurants.entity';
import { RestaurantService } from './restaurants.service';

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

  @Query((type) => MyRestaurantsOutput)
  @Roles(['Owner'])
  async myRestaurants(
    @AuthUser() authUser: User,
  ): Promise<MyRestaurantsOutput> {
    return this.restaurantService.myRestaurants(authUser);
  }

  // myRestaurants
  // myRestaurant
  // editRestaurant
  // deleteRestaurant
  // restaurants
  // restaurant
  // searchRestaurant
  // getRestaurantPosition
}
