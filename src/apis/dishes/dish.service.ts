import { Injectable } from '@nestjs/common';
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
    try {
      const restaurantId = createDishInput.restaurantId;
      const restaurant = await this.restaurants.findOne(
        { id: restaurantId },
        {
          relations: ['dish'],
        },
      );

      if (!restaurant) {
        return {
          ok: false,
          error: 'Could not find restaurant',
        };
      }

      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }

      if (
        restaurant.dishes.find((dish) => dish.name === createDishInput.name)
      ) {
        return {
          ok: false,
          error: 'The dish already exists',
        };
      }

      await this.dishes.save(
        this.dishes.create({ ...createDishInput, restaurant }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not create dish',
      };
    }
  }

  async findDish(findDishInput: FindDishInput): Promise<FindDishOutput> {
    try {
      const dish = await this.dishes.findOne({
        id: findDishInput.id,
        restaurant: {
          id: findDishInput.restaurantId,
        },
      });

      return {
        ok: true,
        dish,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not find dish',
      };
    }
  }

  async getDishes({ restaurantId }: GetDishesInput): Promise<GetDishesOutput> {
    try {
      const dishes = await this.dishes.find({
        restaurant: {
          id: restaurantId,
        },
      });

      if (!dishes) {
        return {
          ok: false,
          error: 'Dishes not found',
        };
      }

      return {
        ok: true,
        dishes,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not find dish',
      };
    }
  }

  async updateDish(
    owner: User,
    updateDishInput: UpdateDishInput,
  ): Promise<UpdateDishOutput> {
    try {
      const dish = await this.dishes.findOne(
        {
          id: updateDishInput.id,
          restaurant: {
            id: updateDishInput.restaurantId,
          },
        },
        {
          relations: ['restaurant'],
        },
      );

      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found',
        };
      }

      if (dish.restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: "You can't do that",
        };
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
      const dish = await this.dishes.findOne(
        {
          id: deleteDishInput.id,
          restaurant: {
            id: deleteDishInput.restaurantId,
          },
        },
        {
          relations: ['restaurant'],
        },
      );

      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found',
        };
      }

      if (dish.restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: "You can't do that",
        };
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
