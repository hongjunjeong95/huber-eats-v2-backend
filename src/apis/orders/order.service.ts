import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { FindConditions, ObjectLiteral, Repository } from 'typeorm';

import {
  COOKED_ORDER,
  NEW_PENDING_ORDER,
  ORDER_UPDATED,
  PUB_SUB,
} from '@apis/common/common.constants';
import { Dish } from '@apis/dishes/entities/dish.entity';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';
import { User, UserRole } from '@apis/users/entities/user.entity';
import {
  CreateOrderInput,
  CreateOrderOutput,
} from '@apis/orders/dtos/create-order.dto';
import {
  FindOrderInput,
  FindOrderOutput,
} from '@apis/orders/dtos/find-order.dto';
import {
  GetOrdersInput,
  GetOrdersOutput,
} from '@apis/orders/dtos/get-orders.dto';
import {
  TakeOrderByDeliverInput,
  TakeOrderByDeliverOutput,
} from '@apis/orders/dtos/take-order-by-deliver.dto';
import {
  UpdateOrderStatusInput,
  UpdateOrderStatusOutput,
} from '@apis/orders/dtos/update-order.dto';
import { OrderItem } from '@apis/orders/entities/order-item.entity';
import { Order, OrderStatus } from '@apis/orders/entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,

    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,

    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,

    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  // Service for ResolveFields
  // Order

  async getOrdersByWhere({
    where,
  }: {
    where?:
      | FindConditions<Order>[]
      | FindConditions<Order>
      | ObjectLiteral
      | string;
  }) {
    return this.orders.find({
      where,
    });
  }

  async getItemsByWhere({
    where,
  }: {
    where?:
      | FindConditions<OrderItem>[]
      | FindConditions<OrderItem>
      | ObjectLiteral
      | string;
  }) {
    return this.orderItems.find({
      where,
    });
  }

  // Service for ResolveFields
  // OrderItem

  async findOrderByIdForManyToOne({
    table,
    id,
  }: {
    table: string;
    id: number;
  }) {
    return this.orders
      .createQueryBuilder('order')
      .leftJoinAndSelect(`order.${table}s`, table)
      .where(`${table}.id = :id`, { id })
      .getOne();
  }

  // Business Logic

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);

      if (!restaurant) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Restaurant not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      let orderFinalPrice = 0;
      const orderItems: OrderItem[] = [];
      for (const item of items) {
        const dish = await this.dishes.findOne(item.dishId);

        if (!dish) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: 'Dish not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        let dishFinalPrice = dish.price;
        if (item.options) {
          for (const itemOption of item.options) {
            const dishOption = dish.options.find(
              (dishOption) => dishOption.name === itemOption.name,
            );

            if (dishOption) {
              const dishOptionChoice = dishOption.choices.find(
                (dishOptionChoice) =>
                  dishOptionChoice.name === itemOption.choice,
              );

              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  dishFinalPrice += dishOptionChoice.extra;
                }
              }
            }
          }
        }
        orderFinalPrice += dishFinalPrice;

        const orderItem = await this.orderItems.save(
          await this.orderItems.create({
            dish,
            options: item.options,
          }),
        );
        orderItems.push(orderItem);
      }
      const order = await this.orders.save(
        await this.orders.create({
          customer,
          restaurant,
          total: orderFinalPrice,
          items: orderItems,
        }),
      );

      await this.pubSub.publish(NEW_PENDING_ORDER, {
        pendingOrder: { order, ownerId: restaurant.ownerId },
      });

      return {
        ok: true,
        orderId: order.id,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not create order',
      };
    }
  }

  async getOrders(
    user: User,
    { restaurantId, status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    try {
      let orders: Order[];

      if (user.role === UserRole.Client) {
        orders = await this.orders.find({
          where: {
            customer: user,
            ...(status && { status }),
          },
        });
      } else if (user.role === UserRole.Owner) {
        const restaurant = await this.restaurants.findOne({
          where: {
            id: restaurantId,
          },
        });

        if (!restaurant) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              error: 'Restaurant not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        orders = await this.orders.find({
          where: {
            restaurant,
          },
          order: {
            id: 'ASC',
          },
        });
      } else if (user.role === UserRole.Deliver) {
        orders = await this.orders.find({
          where: {
            deliver: user,
            ...(status && { status }),
          },
        });
      }

      if (status) {
        orders = orders.filter((order) => order.status === status);
      }

      return {
        ok: true,
        orders,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not get orders',
      };
    }
  }

  canSeeOrder(user: User, order: Order) {
    let canSee = true;
    if (user.role === UserRole.Client && user.id !== order.customerId) {
      canSee = false;
    } else if (
      user.role === UserRole.Owner &&
      user.id !== order.restaurant.ownerId
    ) {
      canSee = false;
    } else if (user.role === UserRole.Deliver && user.id !== order.deliverId) {
      canSee = false;
    }

    return canSee;
  }

  async findOrder(
    user: User,
    { orderId }: FindOrderInput,
  ): Promise<FindOrderOutput> {
    const order = await this.orders.findOne(
      {
        id: orderId,
      },
      {
        relations: ['restaurant'],
      },
    );

    if (!order) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Order not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!this.canSeeOrder(user, order)) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'You can not see that.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      ok: true,
      order,
    };
  }

  async updateOrderStatus(
    user: User,
    { orderId, status }: UpdateOrderStatusInput,
  ): Promise<UpdateOrderStatusOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['restaurant', 'items', 'items.dish', 'customer', 'deliver'],
      });

      if (!order) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Order not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!this.canSeeOrder(user, order)) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'You can not see that.',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      let canEdit = true;
      if (user.role === UserRole.Client) {
        canEdit = false;
      } else if (user.role === UserRole.Owner) {
        if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
          canEdit = false;
        }
      } else if (user.role === UserRole.Deliver) {
        if (
          status !== OrderStatus.PickedUp &&
          status !== OrderStatus.Delivered
        ) {
          canEdit = false;
        }
      }

      if (!canEdit) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'You have no authorization.',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      await this.orders.save({
        id: orderId,
        status,
      });

      const newOrder = { ...order, status };

      if (user.role === UserRole.Owner) {
        if (status === OrderStatus.Cooked) {
          await this.pubSub.publish(COOKED_ORDER, {
            cookedOrder: newOrder,
          });
        }
      }

      await this.pubSub.publish(ORDER_UPDATED, { orderUpdated: newOrder });

      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not update order',
      };
    }
  }

  async takeOrderByDeliver(
    deliver: User,
    { orderId }: TakeOrderByDeliverInput,
  ): Promise<TakeOrderByDeliverOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['customer', 'restaurant'],
      });

      if (!order) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Order not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (order.deliver) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'This order already has a driver',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.orders.save({
        id: orderId,
        deliver,
      });

      await this.pubSub.publish(ORDER_UPDATED, {
        orderUpdated: { ...order, deliver },
      });

      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not assign deliver to order',
      };
    }
  }
}
