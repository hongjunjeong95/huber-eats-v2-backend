import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { CreateRestaurantInput } from '@apis/restaurants/dtos/create-restaurant.dto';

@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field((type) => Int)
  restaurantId: number;
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {
  @Field((type) => Restaurant)
  restaurant?: Restaurant;
}
