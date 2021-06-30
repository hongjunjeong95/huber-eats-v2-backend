import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Core } from 'src/common/entities/common.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery',
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
}
