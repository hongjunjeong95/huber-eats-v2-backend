import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import config from './config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test",
    ignoreEnvFile: process.env.NODE_ENV === 'production',
    validationSchema: Joi.object({
      NODE_ENV: Joi.string().valid('dev', 'production', 'test').required(),
      DB_HOST: Joi.string(),
      DB_PORT: Joi.string(),
      DB_USERNAME: Joi.string(),
      DB_PASSWORD: Joi.string(),
      DB_NAME: Joi.string(),
    })
  }),
  GraphQLModule.forRoot({
    autoSchemaFile: true
  }),
  TypeOrmModule.forRoot({
    type: "postgres",
    ...(process.env.DATABASE_URL ? {
      url: process.env.DATABASE_URL
    } : {
      host: config.db.host,
      port: +config.db.port,
      name: config.db.name,
      username: config.db.username,
      password: config.db.password,
    })
  })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
