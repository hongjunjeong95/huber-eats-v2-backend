import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';

@InputType()
export class TakeOrderByDeliverInput {
  @Field((type) => Int)
  orderId: number;
}

@ObjectType()
export class TakeOrderByDeliverOutput extends CoreOutput {}
