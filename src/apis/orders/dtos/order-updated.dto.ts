import { InputType, PickType } from '@nestjs/graphql';

import { Order } from '@apis/orders/entities/order.entity';

@InputType()
export class OrderUpdatedInput extends PickType(Order, ['id']) {}
