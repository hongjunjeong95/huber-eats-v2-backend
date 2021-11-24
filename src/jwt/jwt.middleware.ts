import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

import { UserService } from '@apis/users/users.service';
import { JwtService } from '@jwt/jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      if (token) {
        const decoded = this.jwtService.verify(token);
        console.log(decoded);
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const { ok, user } = await this.userService.findById(decoded['id']);
          if (ok) {
            req['user'] = user;
          }
        }
      }
    }
    next();
  }
}
