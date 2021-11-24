import { Field, InputType, ObjectType } from '@nestjs/graphql';

import {
  PaginationInput,
  PaginationOutput,
} from '@apis/common/dtos/pagination.dto';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';

@InputType()
export class GetAllRestaurantsInput extends PaginationInput {}

@ObjectType()
export class GetAllRestaurantsOutput extends PaginationOutput {
  @Field((type) => [Restaurant])
  restaurants?: Restaurant[];
}
