import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { Core } from 'src/common/entities/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@InputType('DishInputType')
@ObjectType()
@Entity()
export class Dish extends Core {
  @Field((type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((type) => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field((type) => String)
  @Column()
  @IsString()
  photo: string;

  @Field((type) => String)
  @Column()
  @IsString()
  description: string;

  @Field((type) => String)
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.menu)
  restaurant: Restaurant;

  // @Column()
  // @Field((type) => String)
  // @IsString()
  // name: string;

  // price, description, photo, restaurant, options
}
