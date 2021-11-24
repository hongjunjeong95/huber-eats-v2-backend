import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@apis/users/entities/user.entity';
import { Verification } from '@apis/users/entities/verification.entity';
import { UserResolver } from '@apis/users/users.resolver';
import { UserService } from '@apis/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  providers: [UserResolver, UserService],
  // providers[]에 같이 있는 UserResolver는 UserService를 사용할 수 있지만
  // users.module 밖에 있는 jwt.middleware.ts는 UserService를 사용할 수 없다.
  // 그렇기 때문에 exports에 추가해줘야 한다.
  exports: [UserService],
})
export class UsersModule {}
