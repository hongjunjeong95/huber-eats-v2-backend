import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { CategoryRepository } from '@apis/restaurants/repositories/category.repository';
import { GetAllCategoriesOutput } from '@apis/categories/dtos/get-all-categories.dto';
import {
  GetRestaurantsOnCategoryInput,
  GetRestaurantsOnCategoryOutput,
} from '@apis/categories/dtos/get-restaurants-on-category.dto';
import { Category } from '@apis/categories/entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categories: CategoryRepository,

    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  countRestaurants(category: Category) {
    return this.restaurants.count({ category });
  }

  async getAllCategories(): Promise<GetAllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not load categories',
      };
    }
  }

  async getRestaurantsOnCategory({
    slug,
    page,
  }: GetRestaurantsOnCategoryInput): Promise<GetRestaurantsOnCategoryOutput> {
    try {
      const takePages = 3;
      const category = await this.categories.findOne({ slug });

      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }
      const [restaurants, totalRestaurants] =
        await this.restaurants.findAndCount({
          where: {
            category,
          },
          skip: (page - 1) * takePages,
          take: takePages,
        });
      return {
        ok: true,
        restaurants,
        totalPages: Math.ceil(totalRestaurants / takePages),
        totalResults: totalRestaurants,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not load categories',
      };
    }
  }
}
