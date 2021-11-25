import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Dish } from '@apis/dishes/entities/dish.entity';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { OrderItem } from '@apis/orders/entities/order-item.entity';
import { Order } from '@apis/orders/entities/order.entity';
import { OrderResolver } from '@apis/orders/order.resolver';
import { OrderItemResolver } from '@apis/orders/orderItem.resolver';
import { OrderService } from '@apis/orders/order.service';
import { UserService } from '@apis/users/users.service';
import { RestaurantService } from '@apis/restaurants/restaurants.service';
import { User } from '@apis/users/entities/user.entity';
import { Verification } from '@apis/users/entities/verification.entity';
import { CategoryRepository } from '@apis/restaurants/repositories/category.repository';
import { DishService } from '../dishes/dish.service';

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
    OrderResolver,
    OrderItemResolver,
    OrderService,
    UserService,
    RestaurantService,
    DishService,
  ],
})
export class OrderModule {}
