import { Field, InputType, ObjectType } from '@nestjs/graphql';

import {
  PaginationInput,
  PaginationOutput,
} from '@apis/common/dtos/pagination.dto';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';

@InputType()
export class GetRestaurantsInput extends PaginationInput {
  @Field((type) => String, { nullable: true })
  slug?: string;

  @Field((type) => String, { nullable: true })
  query?: string;
}

@ObjectType()
export class GetRestaurantsOutput extends PaginationOutput {
  @Field((type) => [Restaurant])
  restaurants?: Restaurant[];
}
