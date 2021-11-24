import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import * as bcrypt from 'bcrypt';

import { Core } from '@apis/common/entities/common.entity';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { Order } from '@apis/orders/entities/order.entity';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Deliver = 'Deliver',
}

registerEnumType(UserRole, { name: 'UserRole' });

// relationship 때문에 ObjectType과 InputType이 동시에 존재해서
// server가 에러를 발생시킨다. 이 때문에 InputType에 'UserInputType'
// 이라고 이름을 지정해줘야 한다.
@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends Core {
  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  @IsBoolean()
  verified: boolean;

  @OneToMany((type) => Restaurant, (restaurants) => restaurants.owner)
  @Field((type) => [Restaurant])
  restaurants: Restaurant[];

  @OneToMany((type) => Order, (order) => order.customer)
  @Field((type) => [Order])
  orders: Order[];

  @OneToMany((type) => Order, (order) => order.deliver)
  @Field((type) => [Order])
  rides: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
