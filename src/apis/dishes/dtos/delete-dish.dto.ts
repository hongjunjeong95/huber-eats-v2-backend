import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { Dish } from '@apis/dishes/entities/dish.entity';

@InputType()
export class DeleteDishInput extends PickType(Dish, ['id']) {
  @Field((type) => Int)
  restaurantId: number;
}

@ObjectType()
export class DeleteDishOutput extends CoreOutput {
  @Field((type) => Dish)
  dish?: Dish;
}
