import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { CategoryRepository } from '@apis/restaurants/repositories/category.repository';
import { CategoryResolver } from '@apis/categories/category.resolver';
import { CategoryService } from '@apis/categories/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryRepository, Restaurant])],
  providers: [CategoryResolver, CategoryService],
})
export class CategoryModule {}
