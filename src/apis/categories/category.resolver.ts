import { Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { CategoryService } from '@apis/categories/category.service';
import { GetAllCategoriesOutput } from '@apis/categories/dtos/get-all-categories.dto';
import { Category } from '@apis/categories/entities/category.entity';
import { RestaurantService } from '@apis/restaurants/restaurants.service';

@Resolver((of) => Category)
export class CategoryResolver {
  constructor(
    //
    private readonly categoryService: CategoryService,
    private readonly restaurantService: RestaurantService,
  ) {}

  @ResolveField((returns) => Int)
  restaurantCount(@Parent() category: Category): Promise<Number> {
    return this.categoryService.countRestaurants(category);
  }

  @ResolveField()
  async restaurants(@Parent() category: Category) {
    const { id } = category;
    const restaurants = await this.restaurantService.getRestaurantsByWhere({
      where: {
        category: {
          id,
        },
      },
    });
    return restaurants;
  }

  @Query((returns) => GetAllCategoriesOutput)
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}
