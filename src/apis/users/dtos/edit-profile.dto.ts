import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';

import { CoreOutput } from '@apis/common/dtos/output.dto';
import { User } from '@apis/users/entities/user.entity';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
