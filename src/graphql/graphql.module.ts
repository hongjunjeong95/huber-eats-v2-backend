import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';

import { TOKEN_KEY } from '@apis/common/common.constants';

@Module({
  imports: [
    NestGraphQLModule.forRoot({
      playground: process.env.NODE_ENV !== 'production',
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },

      context: ({ req, res, connection }) => {
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
  ],
})
export class GraphQLModule {}
