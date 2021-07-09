import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Dish } from '../entities/dish.entity';

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
