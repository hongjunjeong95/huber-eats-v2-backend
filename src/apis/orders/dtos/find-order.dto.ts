import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { Order } from '@apis/orders/entities/order.entity';

@InputType()
export class FindOrderInput {
  @Field((type) => Int)
  orderId: number;
}

@ObjectType()
export class FindOrderOutput extends CoreOutput {
  @Field((type) => Order, { nullable: true })
  order?: Order;
}
