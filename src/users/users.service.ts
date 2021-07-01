import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }
      await this.users.save(this.users.create({ email, password, role }));

      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  // async login({ email, password }: LoginInput): Promise<LoginOutput> {
  //   try {
  //     const user = await this.users.findOne(
  //       { email },
  //       { select: ['id', 'password'] },
  //     );

  //     if (!user) {
  //       return {
  //         ok: false,
  //         error: 'User not found',
  //       };
  //     }

  //     const passwordCorrect = await user.checkPassword(password);
  //     if (!passwordCorrect) {
  //       return {
  //         ok: false,
  //         error: 'Wrong password',
  //       };
  //     }

  //     const token = this.jwtService.sign(user.id);

  //     return {
  //       ok: true,
  //       token,
  //     };
  //   } catch (error) {
  //     return {
  //       ok: false,
  //       error: "Can't log user in.",
  //     };
  //   }
  // }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      // const user = await this.users.findOne({ email });

      const user = await this.users.findOne(
        { email },
        { select: ['password'] },
      );

      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong Password',
        };
      }

      const token = this.jwtService.sign(user.id);

      return {
        ok: true,
        token,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Can't login",
      };
    }
  }
}
