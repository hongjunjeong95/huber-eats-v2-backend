import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AuthModule } from '@auth/auth.module';
import { CategoryModule } from '@apis/categories/category.module';
import { JwtModule } from '@jwt/jwt.module';
import { MailModule } from '@mail/mail.module';
import { RestaurantsModule } from '@apis/restaurants/restaurants.module';
import { UsersModule } from '@apis/users/users.module';
import { DishModule } from '@apis/dishes/dish.module';
import { OrderModule } from '@apis/orders/order.module';
import { CommonModule } from '@apis/common/common.module';
import { UploadsModule } from '@uploads/uploads.module';
import { ConfigModule } from '@config/config.module';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [
    ConfigModule,
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
    DatabaseModule,
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
    UploadsModule.forRoot({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    }),
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
