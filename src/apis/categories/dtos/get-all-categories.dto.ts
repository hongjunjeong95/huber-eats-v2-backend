import { Field, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { Category } from '@apis/categories/entities/category.entity';

@ObjectType()
export class GetAllCategoriesOutput extends CoreOutput {
  @Field((type) => [Category])
  categories?: Category[];
}
