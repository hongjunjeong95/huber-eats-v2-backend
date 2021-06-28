import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Core } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Deliver = 'Deliver',
}

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends Core {
  @Column({ type: 'string' })
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column({ type: 'string' })
  @Field((type) => String)
  @IsEmail()
  password: string;

  @Column({ type: 'enum' })
  @Field((type) => UserRole)
  @IsEmail()
  role: UserRole;

  // todo restaurants, orders, lat, lng, verified
}
