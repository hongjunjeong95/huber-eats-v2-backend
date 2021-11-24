import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { Dish } from '@apis/dishes/entities/dish.entity';

@InputType()
export class FindDishInput extends PickType(Dish, ['id']) {}

@ObjectType()
export class FindDishOutput extends CoreOutput {
  @Field((type) => Dish)
  dish?: Dish;
}
