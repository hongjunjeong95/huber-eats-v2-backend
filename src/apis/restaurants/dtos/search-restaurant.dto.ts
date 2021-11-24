import { Field, InputType, ObjectType } from '@nestjs/graphql';

import {
  PaginationInput,
  PaginationOutput,
} from '@apis/common/dtos/pagination.dto';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';

@InputType()
export class SearchRestaurantByNameInput extends PaginationInput {
  @Field((type) => String)
  query: string;
}

@ObjectType()
export class SearchRestaurantByNameOutput extends PaginationOutput {
  @Field((type) => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
}
