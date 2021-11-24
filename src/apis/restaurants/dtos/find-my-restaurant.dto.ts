import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';

@InputType()
export class FindMyRestaurantByIdInput extends PickType(Restaurant, ['id']) {}

@ObjectType()
export class FindMyRestaurantByIdOutput extends CoreOutput {
  @Field((type) => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
