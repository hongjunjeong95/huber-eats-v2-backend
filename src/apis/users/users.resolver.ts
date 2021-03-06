import { Res } from '@nestjs/common';
import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Request } from 'express';

import { AuthUser } from '@auth/auth-user.decorator';
import { Roles } from '@auth/role.decorator';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from '@apis/users/dtos/create-account.dto';
import {
  EditProfileInput,
  EditProfileOutput,
} from '@apis/users/dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from '@apis/users/dtos/login.dto';
import {
  UserProfileInput,
  UserProfileOutput,
} from '@apis/users/dtos/user-profile.dto';
import {
  VerifyEmailInput,
  VerifyEmailOutput,
} from '@apis/users/dtos/verify-email.dto';
import { User } from '@apis/users/entities/user.entity';
import { UserService } from '@apis/users/users.service';
import { RestaurantService } from '../restaurants/restaurants.service';
import { OrderService } from '../orders/order.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    //
    private readonly usersService: UserService,
    private readonly restaurantService: RestaurantService,
    private readonly ordersService: OrderService,
  ) {}

  @ResolveField()
  async restaurants(@Parent() user: User) {
    const { id } = user;
    const restaurants = await this.restaurantService.getRestaurantsByWhere({
      where: {
        owner: {
          id,
        },
      },
    });
    return restaurants;
  }

  @ResolveField()
  async orders(@Parent() user: User) {
    const { id } = user;
    const orders = await this.ordersService.getOrdersByWhere({
      where: {
        customer: {
          id,
        },
      },
    });
    return orders;
  }

  @ResolveField()
  async rides(@Parent() user: User) {
    const { id } = user;
    const orders = await this.ordersService.getOrdersByWhere({
      where: {
        deliver: {
          id,
        },
      },
    });
    return orders;
  }

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(
    @Args('input') loginInput: LoginInput,
    @Res({ passthrough: true }) req: Request,
  ): Promise<LoginOutput> {
    return this.usersService.login(loginInput, req);
  }

  @Query((returns) => User)
  @Roles(['Any'])
  me(@AuthUser() user: User) {
    return user;
  }

  @Query((returns) => UserProfileOutput)
  @Roles(['Any'])
  userProfile(
    @Args('input') userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }

  @Mutation((returns) => EditProfileOutput)
  @Roles(['Any'])
  editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation((returns) => VerifyEmailOutput)
  @Roles(['Any'])
  verifyEmail(
    @Args('input') verifyEmailInput: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.usersService.verifyEmail(verifyEmailInput);
  }
}
