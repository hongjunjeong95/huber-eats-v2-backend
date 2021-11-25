import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CookieOptions, Request } from 'express';
import { Repository } from 'typeorm';

import { JwtService } from '@jwt/jwt.service';
// import { MailService } from '@mail/mail.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from '@apis/users/dtos/create-account.dto';
import {
  EditProfileInput,
  EditProfileOutput,
} from '@apis/users/dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from '@apis/users/dtos/login.dto';
import { UserProfileOutput } from '@apis/users/dtos/user-profile.dto';
import {
  VerifyEmailInput,
  VerifyEmailOutput,
} from '@apis/users/dtos/verify-email.dto';
import { User } from '@apis/users/entities/user.entity';
import { Verification } from '@apis/users/entities/verification.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,

    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,

    private readonly jwtService: JwtService, // private readonly mailService: MailService,
  ) {}

  // Service for ResolveFields
  async findOwnerByRestaurantId({ id }: { id: number }) {
    return this.users.findOne({
      join: {
        alias: 'user',
        innerJoin: { restaurants: 'user.restaurants' },
      },
      where: (qb) => {
        qb.where('restaurants.id = :id', { id });
      },
    });
  }

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

      // const verification = await this.verifications.save(
      //   this.verifications.create({ user }),
      // );

      // this.mailService.sendVerificationEmail(user.email, verification.code);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login(
    { email, password }: LoginInput,
    req: Request,
  ): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
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
      const options: CookieOptions = {
        maxAge: 86400 * 1000,
        httpOnly: true,
        sameSite: 'none', // Client가 Server와 다른 IP(다른 도메인) 이더라도 동작하게 한다.
        secure: true, // sameSite:'none'을 할 경우 secure:true로 설정해준다.
      };

      req.res.cookie('token', token, options);

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

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ id });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'User not found',
      };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne({ id: userId });

      if (email) {
        user.email = email;
      }

      if (password) {
        user.password = password;
      }

      await this.users.save(user);
      return {
        ok: true,
        user,
      };
    } catch (error) {
      console.error(error);
      return {
        ok: false,
        error: 'Could not update user',
      };
    }
  }

  async verifyEmail({ code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne(
        { code },
        { relations: ['user'] },
      );

      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verifications.delete(verification.id);
        return { ok: true };
      }
      return { ok: false, error: 'Verification not found.' };
    } catch (error) {
      return { ok: false, error: 'Could not verify email.' };
    }
  }
}
