import { Resolver } from '@nestjs/graphql';
import { Order } from './entities/order.entity';

@Resolver((of) => Order)
export class OrderResolver {}
