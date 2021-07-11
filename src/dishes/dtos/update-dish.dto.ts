import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Dish } from '../entities/dish.entity';

@InputType()
export class UpdateDishInput extends PartialType(
  PickType(Dish, ['id', 'name', 'price', 'photo', 'description']),
) {
  @Field((type) => Int)
  restaurantId: number;
}

@ObjectType()
export class UpdateDishOutput extends CoreOutput {
  @Field((type) => Dish)
  dish?: Dish;
}
