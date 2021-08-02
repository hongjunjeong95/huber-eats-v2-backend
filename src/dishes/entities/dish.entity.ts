import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { Core } from 'src/common/entities/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
export class DishChoice {
  @Field((type) => String)
  @IsString()
  name: string;

  @Field((type) => Int, { nullable: true })
  @IsNumber()
  extra?: number;
}

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
  @Field((type) => String)
  @IsString()
  name: string;

  @Field((type) => [DishChoice], { nullable: true })
  choices?: DishChoice[];
}

@InputType('DishInputType', { isAbstract: true })
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

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.menu, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @Field((type) => [DishOption], { nullable: true })
  @Column({ nullable: true, type: 'json' })
  options?: DishOption[];

  // options
}
