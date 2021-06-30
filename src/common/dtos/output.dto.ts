import { Field, ObjectType } from '@nestjs/graphql';
import { boolean } from 'joi';

@ObjectType()
export class CoreOutput {
  @Field((type) => Boolean)
  ok: boolean;

  @Field((type) => String, { nullable: true })
  error?: string;
}
