import { InputType, ObjectType, PickType } from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { Restaurant } from '@apis/restaurants/entities/restaurant.entity';

@InputType()
export class DeleteRestaurantInput extends PickType(Restaurant, ['id']) {}

@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput {}
