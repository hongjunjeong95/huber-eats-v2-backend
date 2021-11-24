import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { Dish } from '@apis/dishes/entities/dish.entity';

@InputType()
export class CreateDishInput extends PickType(Dish, [
  'name',
  'price',
  'photo',
  'description',
  'options',
]) {
  @Field((type) => Int)
  restaurantId: number;
}

@ObjectType()
export class CreateDishOutput extends CoreOutput {
  @Field((type) => Dish)
  dish?: Dish;
}
