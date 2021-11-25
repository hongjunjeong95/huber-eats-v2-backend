import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Core } from '@apis/common/entities/common.entity';
import { Dish } from '@apis/dishes/entities/dish.entity';
import { Order } from '@apis/orders/entities/order.entity';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field((type) => String)
  @IsString()
  name: string;

  @Field((type) => String, { nullable: true })
  @IsString()
  choice: string;
}

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends Core {
  @Field((type) => Order)
  @ManyToOne((type) => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @Field((type) => Dish)
  @ManyToOne((type) => Dish, { onDelete: 'SET NULL' })
  dish: Dish;

  @Field((type) => [OrderItemOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: OrderItemOption[];
}
