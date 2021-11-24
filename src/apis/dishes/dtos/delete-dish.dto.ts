import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { Dish } from '@apis/dishes/entities/dish.entity';

@InputType()
export class DeleteDishInput extends PickType(Dish, ['id']) {}

@ObjectType()
export class DeleteDishOutput extends CoreOutput {
  @Field((type) => Dish)
  dish?: Dish;
}
