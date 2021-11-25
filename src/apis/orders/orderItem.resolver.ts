import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { OrderItem } from '@apis/orders/entities/order-item.entity';
import { OrderService } from '@apis/orders/order.service';
import { DishService } from '../dishes/dish.service';

@Resolver((of) => OrderItem)
export class OrderItemResolver {
  constructor(
    //
    private readonly ordersService: OrderService,
    private readonly dishService: DishService,
  ) {}

  // OrderItem

  @ResolveField()
  async order(@Parent() item: OrderItem) {
    const { id } = item;
    const order = await this.ordersService.findOrderByIdForManyToOne({
      table: 'item',
      id,
    });
    return order;
  }

  @ResolveField()
  async dish(@Parent() item: OrderItem) {
    const { id } = item;
    const dish = await this.dishService.findDishByIdForManyToOne({
      table: 'item',
      id,
    });
    return dish;
  }
}
