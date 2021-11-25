import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, ObjectLiteral, Repository } from 'typeorm';

import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { User } from '@apis/users/entities/user.entity';
import {
  CreateDishInput,
  CreateDishOutput,
} from '@apis/dishes/dtos/create-dish.dto';
import {
  DeleteDishInput,
  DeleteDishOutput,
} from '@apis/dishes/dtos/delete-dish.dto';
import { FindDishInput, FindDishOutput } from '@apis/dishes/dtos/find-dish.dto';
import {
  GetDishesInput,
  GetDishesOutput,
} from '@apis/dishes/dtos/get-dishes.dto';
import {
  UpdateDishInput,
  UpdateDishOutput,
} from '@apis/dishes/dtos/update-dish.dto';
import { Dish } from '@apis/dishes/entities/dish.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,

    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  // Service for ResolveFields
  async getDishesByWhere({
    where,
  }: {
    where?:
      | FindConditions<Dish>[]
      | FindConditions<Dish>
      | ObjectLiteral
      | string;
  }) {
    return this.dishes.find({
      where,
    });
  }

  async createDish(
    owner: User,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    const restaurantId = createDishInput.restaurantId;
    const restaurant = await this.restaurants.findOne(
      { id: restaurantId },
      {
        relations: ['dishes'],
      },
    );

    if (!restaurant) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Restaurant not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (owner.id !== restaurant.ownerId) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'You have no authorization',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (restaurant.dishes.find((dish) => dish.name === createDishInput.name)) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'The dish already exists',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const dish = await this.dishes.save(
      this.dishes.create({ ...createDishInput, restaurant }),
    );

    return {
      ok: true,
      dish,
    };
  }

  async findDish(findDishInput: FindDishInput): Promise<FindDishOutput> {
    const dish = await this.dishes.findOne({
      id: findDishInput.id,
    });

    if (!dish) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Dish not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      ok: true,
      dish,
    };
  }

  async getDishes({ restaurantId }: GetDishesInput): Promise<GetDishesOutput> {
    const dishes = await this.dishes.find({
      restaurant: {
        id: restaurantId,
      },
    });

    if (!dishes) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Dishes not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      ok: true,
      dishes,
    };
  }

  async updateDish(
    owner: User,
    updateDishInput: UpdateDishInput,
  ): Promise<UpdateDishOutput> {
    try {
      const dish = await this.dishes.findOne({
        id: updateDishInput.id,
      });

      if (!dish) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Dish not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (dish.restaurant.ownerId !== owner.id) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'You have no authorization',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      await this.dishes.save({
        id: updateDishInput.id,
        ...updateDishInput,
      });

      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not udpate dish',
      };
    }
  }

  async deleteDish(
    owner: User,
    deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    try {
      const dish = await this.dishes.findOne({
        id: deleteDishInput.id,
      });

      if (!dish) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Dish not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (dish.restaurant.ownerId !== owner.id) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'You have no authorization',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      await this.dishes.delete(dish.id);

      return {
        ok: true,
        dish,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not delete dish',
      };
    }
  }
}
