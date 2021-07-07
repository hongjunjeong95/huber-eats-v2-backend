import { Query, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { GetAllCategoriesOutput } from './dtos/get-all-categories.dto';
import { Category } from './entities/category.entity';

@Resolver((of) => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query((returns) => GetAllCategoriesOutput)
  async getAllCategories(): Promise<GetAllCategoriesOutput> {
    return this.categoryService.getAllCategories();
  }
}
