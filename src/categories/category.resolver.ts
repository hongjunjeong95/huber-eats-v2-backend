import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { GetAllCategoriesOutput } from './dtos/get-all-categories.dto';
import {
  GetRestaurantsOnCategoryInput,
  GetRestaurantsOnCategoryOutput,
} from './dtos/get-restaurants-on-category.dto';
import { Category } from './entities/category.entity';

@Resolver((of) => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @ResolveField((returns) => Int)
  restaurantCount(@Parent() category: Category): Promise<Number> {
    return this.categoryService.countRestaurants(category);
  }

  @Query((returns) => GetAllCategoriesOutput)
  async getAllCategories(): Promise<GetAllCategoriesOutput> {
    return this.categoryService.getAllCategories();
  }

  @Query((returns) => GetRestaurantsOnCategoryOutput)
  async getRestaurantsOnCategory(
    @Args('input') getRestaurantsOnCategoryInput: GetRestaurantsOnCategoryInput,
  ): Promise<GetRestaurantsOnCategoryOutput> {
    return this.categoryService.getRestaurantsOnCategory(
      getRestaurantsOnCategoryInput,
    );
  }
}
