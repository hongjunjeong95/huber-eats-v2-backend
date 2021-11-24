import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { OrderStatus } from '@apis/orders/entities/order.entity';

@InputType()
export class UpdateOrderStatusInput {
  @Field((type) => Int)
  orderId: number;

  @Field((type) => OrderStatus)
  status: OrderStatus;
}

@ObjectType()
export class UpdateOrderStatusOutput extends CoreOutput {}
