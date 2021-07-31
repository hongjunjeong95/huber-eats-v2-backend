import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './categories/category.module';
import { Category } from './categories/entities/category.entity';

import { JwtModule } from './jwt/jwt.module';
import { MailModule } from './mail/mail.module';
import { Dish } from './dishes/entities/dish.entity';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { User } from './users/entities/user.entity';
import { Verification } from './users/entities/verification.entity';
import { UsersModule } from './users/users.module';
import { DishModule } from './dishes/dish.module';
import { OrderModule } from './orders/order.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',

      // Joi와 validationSchema를 통해서 env variables 유효성 검사를 한다.
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production', 'test').required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      context: ({ req, res, connection }) => {
        const TOKEN_KEY = 'authorization';

        let token = '';
        let authorization = '';

        if (req && req.headers && req.headers.hasOwnProperty(TOKEN_KEY)) {
          authorization = req.headers[TOKEN_KEY];
        } else if (
          connection &&
          connection.context &&
          connection.context.hasOwnProperty(TOKEN_KEY)
        ) {
          authorization = connection.context[TOKEN_KEY];
        }

        if (authorization.includes('Bearer')) {
          token = authorization.split(' ')[1];
        }

        return {
          token,
          res,
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            // Postgresql은 localhost에 연결된 경우, password를 안 물어본다.
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          }),

      // TypeORM이 DB에 연결할 때 DB를 나의 모듈의 현재 상태로 migration한다는 뜻이다.
      synchronize: process.env.NODE_ENV !== 'prod',

      // DB에 무슨 일이 일어나는지 콘솔에 표시하는 거다.
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [
        User,
        Verification,
        Restaurant,
        Category,
        Dish,
        Order,
        OrderItem,
      ],
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    CategoryModule,
    DishModule,
    OrderModule,
    CommonModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
