import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class GetAllRestaurantsInput extends PaginationInput {}

@ObjectType()
export class GetAllRestaurantsOutput extends PaginationOutput {
  @Field((type) => [Restaurant])
  restaurants?: Restaurant[];
}
