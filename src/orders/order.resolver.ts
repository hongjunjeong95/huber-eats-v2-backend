import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Roles } from 'src/auth/role.decorator';
import {
  NEW_PENDING_ORDER,
  ORDER_UPDATED,
  PUB_SUB,
} from 'src/common/common.constants';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { FindOrderInput, FindOrderOutput } from './dtos/find-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { OrderUpdatedInput } from './dtos/order-updated.dto';
import {
  TakeOrderByDeliverInput,
  TakeOrderByDeliverOutput,
} from './dtos/take-order-by-deliver.dto';
import {
  UpdateOrderStatusInput,
  UpdateOrderStatusOutput,
} from './dtos/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Resolver((of) => Order)
export class OrderResolver {
  constructor(
    private readonly ordersService: OrderService,

    @Inject(PUB_SUB)
    private readonly pubSub: PubSub,
  ) {}

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
}
