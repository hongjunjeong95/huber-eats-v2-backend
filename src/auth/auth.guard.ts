import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { JwtService } from '@jwt/jwt.service';
import { UserService } from '@apis/users/users.service';
import { AllowedRoles } from '@auth/role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    let token = null;
    const host = GqlExecutionContext.create(context);

    // token 값을 얻는다.
    if (host) {
      if (host.getType() === 'http') {
        const request = host.getArgByIndex(0);
        token = request.headers['x-jwt'];
      } else if (host.getType() === 'graphql') {
        let gqlContext = host.getContext();
        token = gqlContext.token;
      }
    }

    // token 값으로 jwt 인증을 한다.
    if (token) {
      const decoded = this.jwtService.verify(token);

      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { ok, user } = await this.userService.findById(decoded['id']);
        if (ok) {
          let gqlContext = host.getContext();
          gqlContext['user'] = user;

          if (roles.includes('Any')) {
            return true;
          }
          return roles.includes(user.role);
        }
      }
    }

    return false;
  }
}
