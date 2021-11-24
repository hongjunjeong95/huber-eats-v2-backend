import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';

import { Core } from '@apis/common/entities/common.entity';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { User } from '@apis/users/entities/user.entity';
import { OrderItem } from '@apis/orders/entities/order-item.entity';

export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  Cooked = 'Cooked',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends Core {
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.orders, {
    onDelete: 'SET NULL',
    eager: true,
  })
  customer: User;

  @RelationId((order: Order) => order.customer)
  customerId: number;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.rides, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  deliver: User;

  @RelationId((order: Order) => order.deliver)
  deliverId: number;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: 'SET NULL',
    eager: true,
  })
  restaurant: Restaurant;

  @RelationId((order: Order) => order.restaurant)
  restaurantId: number;

  @Field((type) => [OrderItem])
  @OneToMany((type) => OrderItem, (orderItem) => orderItem.order)
  @JoinTable()
  items: OrderItem[];

  @Field((type) => Int)
  @Column()
  @IsNumber()
  total: number;

  @Field((type) => OrderStatus)
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;
}
