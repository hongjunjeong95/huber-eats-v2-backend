import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Core } from '@apis/common/entities/common.entity';
import { User } from '@apis/users//entities/user.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends Core {
  @Column()
  @Field((type) => String)
  @IsString()
  code: string;

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
