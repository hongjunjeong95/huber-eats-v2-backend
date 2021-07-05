import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurants.entity';

@Resolver((of) => Restaurant)
export class RestaurantResolver {}
