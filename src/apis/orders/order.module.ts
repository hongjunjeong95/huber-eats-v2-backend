import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Dish } from '@apis/dishes/entities/dish.entity';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { OrderItem } from '@apis/orders/entities/order-item.entity';
import { Order } from '@apis/orders/entities/order.entity';
import { OrderResolver } from '@apis/orders/order.resolver';
import { OrderService } from '@apis/orders/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Restaurant, Dish])],
  providers: [OrderResolver, OrderService],
})
export class OrderModule {}
