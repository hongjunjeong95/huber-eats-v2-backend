import { Module } from '@nestjs/common';

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
import { GraphQLModule } from '@graphql/graphql.module';

@Module({
  imports: [
    ConfigModule,
    GraphQLModule,
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

    // apis
    CommonModule,
    UsersModule,
    RestaurantsModule,
    CategoryModule,
    DishModule,
    OrderModule,
    UploadsModule.forRoot({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    }),
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
