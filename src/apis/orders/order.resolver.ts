import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { AuthUser } from '@auth/auth-user.decorator';
import { Roles } from '@auth/role.decorator';
import {
  COOKED_ORDER,
  NEW_PENDING_ORDER,
  ORDER_UPDATED,
  PUB_SUB,
} from '@apis/common/common.constants';
import { User } from '@apis/users/entities/user.entity';
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
import { OrderUpdatedInput } from '@apis/orders/dtos/order-updated.dto';
import {
  TakeOrderByDeliverInput,
  TakeOrderByDeliverOutput,
} from '@apis/orders/dtos/take-order-by-deliver.dto';
import {
  UpdateOrderStatusInput,
  UpdateOrderStatusOutput,
} from '@apis/orders/dtos/update-order.dto';
import { Order } from '@apis/orders/entities/order.entity';
import { OrderService } from '@apis/orders/order.service';
import { UserService } from '@apis/users/users.service';
import { RestaurantService } from '@apis/restaurants/restaurants.service';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(
    private readonly ordersService: OrderService,
    private readonly usersService: UserService,
    private readonly restaurantService: RestaurantService,

    @Inject(PUB_SUB)
    private readonly pubSub: PubSub,
  ) {}

  // ResolveFields
  // Order

  @ResolveField()
  async customer(@Parent() order: Order) {
    const { id } = order;
    const customer = await this.usersService.findUserByIdForManyToOne({
      table: 'order',
      id,
    });
    return customer;
  }

  @ResolveField()
  async deliver(@Parent() order: Order) {
    const { id } = order;
    const deliver = await this.usersService.findUserByIdForManyToOne({
      table: 'ride',
      id,
    });
    return deliver;
  }

  @ResolveField()
  async restaurant(@Parent() order: Order) {
    const { id } = order;
    const restaurant =
      await this.restaurantService.findRestaurantByIdForManyToOne({
        table: 'order',
        id,
      });
    return restaurant;
  }

  @ResolveField()
  async items(@Parent() order: Order) {
    const { id } = order;
    const items = await this.ordersService.getItemsByWhere({
      where: {
        order: {
          id,
        },
      },
    });
    return items;
  }

  @Mutation((returns) => CreateOrderOutput)
  @Roles(['Client'])
  async createOrder(
    @AuthUser() customer: User,
    @Args('input') createOrderInput: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    return this.ordersService.createOrder(customer, createOrderInput);
  }

  @Query((returns) => GetOrdersOutput)
  @Roles(['Any'])
  async getOrders(
    @AuthUser() user: User,
    @Args('input') getOrdersInput: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    return this.ordersService.getOrders(user, getOrdersInput);
  }

  @Query((returns) => FindOrderOutput)
  @Roles(['Any'])
  async findOrder(
    @AuthUser() user: User,
    @Args('input') findOrderInput: FindOrderInput,
  ): Promise<FindOrderOutput> {
    return this.ordersService.findOrder(user, findOrderInput);
  }

  @Mutation((returns) => UpdateOrderStatusOutput)
  @Roles(['Any'])
  async updateOrderStatus(
    @AuthUser() user: User,
    @Args('input') updateOrderInput: UpdateOrderStatusInput,
  ): Promise<UpdateOrderStatusOutput> {
    return this.ordersService.updateOrderStatus(user, updateOrderInput);
  }

  @Mutation((returns) => TakeOrderByDeliverOutput)
  @Roles(['Deliver'])
  async takeOrderByDeliver(
    @AuthUser() deliver: User,
    @Args('input') takeOrderByDeliverInput: TakeOrderByDeliverInput,
  ): Promise<TakeOrderByDeliverOutput> {
    return this.ordersService.takeOrderByDeliver(
      deliver,
      takeOrderByDeliverInput,
    );
  }

  @Subscription((returns) => Order, {
    filter: ({ pendingOrder: { ownerId } }, _, { user }) => {
      return ownerId === user.id;
    },
    resolve: ({ pendingOrder: { order } }) => order,
  })
  @Roles(['Owner'])
  pendingOrder() {
    return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
  }

  @Subscription((returns) => Order, {
    filter: (
      { orderUpdated: order }: { orderUpdated: Order },
      { input }: { input: OrderUpdatedInput },
      { user }: { user: User },
    ) => {
      if (
        order.customerId !== user.id &&
        order.restaurant.ownerId !== user.id &&
        order.deliverId !== user.id
      ) {
        return false;
      }
      return order.id === input.id;
    },
  })
  @Roles(['Any'])
  orderUpdated(@Args('input') orderUpdatedInput: OrderUpdatedInput) {
    return this.pubSub.asyncIterator(ORDER_UPDATED);
  }

  @Subscription((returns) => Order)
  @Roles(['Deliver'])
  cookedOrder() {
    return this.pubSub.asyncIterator(COOKED_ORDER);
  }
}
