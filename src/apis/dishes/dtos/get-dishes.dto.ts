import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { Dish } from '@apis/dishes/entities/dish.entity';

@InputType()
export class GetDishesInput {
  @Field((type) => Int)
  restaurantId: number;
}

@ObjectType()
export class GetDishesOutput extends CoreOutput {
  @Field((type) => [Dish])
  dishes?: Dish[];
}
