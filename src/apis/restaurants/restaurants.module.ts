import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Dish } from '@apis/dishes/entities/dish.entity';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { CategoryRepository } from '@apis/restaurants/repositories/category.repository';
import { RestaurantResolver } from '@apis/restaurants/restaurants.resolver';
import { RestaurantService } from '@apis/restaurants/restaurants.service';
import { DishService } from '@apis/dishes/dish.service';
import { OrderService } from '@apis/orders/order.service';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { CategoryService } from '../categories/category.service';
import { UserService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Verification } from '../users/entities/verification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Restaurant,
      Dish,
      User,
      Verification,
      CategoryRepository,
    ]),
  ],
  providers: [
    RestaurantResolver,
    RestaurantService,
    DishService,
    OrderService,
    CategoryService,
    UserService,
  ],
})
export class RestaurantsModule {}
