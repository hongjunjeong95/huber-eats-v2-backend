import { Field, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';

@ObjectType()
export class GetMyRestaurantsOutput extends CoreOutput {
  @Field((type) => [Restaurant])
  restaurants?: Restaurant[];
}
