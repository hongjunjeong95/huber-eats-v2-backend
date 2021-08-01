import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Core } from 'src/common/entities/common.entity';
import { Dish } from 'src/dishes/entities/dish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

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

  @Field((type) => [OrderItemOption])
  @Column({ type: 'json', nullable: true })
  options?: OrderItemOption[];
}
