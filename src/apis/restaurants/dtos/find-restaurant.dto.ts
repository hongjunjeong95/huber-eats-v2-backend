import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';

@InputType()
export class FindRestaurantByIdInput extends PickType(Restaurant, ['id']) {}

@ObjectType()
export class FindRestaurantByIdOutput extends CoreOutput {
  @Field((type) => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
