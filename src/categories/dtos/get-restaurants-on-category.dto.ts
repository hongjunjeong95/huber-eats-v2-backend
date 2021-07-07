import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

@InputType()
export class GetRestaurantsOnCategoryInput extends PaginationInput {
  @Field((type) => String)
  slug?: string;
}

@ObjectType()
export class GetRestaurantsOnCategoryOutput extends PaginationOutput {
  @Field((type) => [Restaurant])
  restaurants?: Restaurant[];
}