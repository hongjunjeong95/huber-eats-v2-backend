import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { CategoryRepository } from '@apis/restaurants/repositories/category.repository';
import { GetAllCategoriesOutput } from '@apis/categories/dtos/get-all-categories.dto';
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
}
