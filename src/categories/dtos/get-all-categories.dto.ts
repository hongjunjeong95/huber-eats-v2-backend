import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationOutput } from 'src/common/dtos/pagination.dto';
import { Category } from '../entities/category.entity';

@ObjectType()
export class GetAllCategoriesOutput extends PaginationOutput {
  @Field((type) => [Category])
  categories?: Category[];
}
