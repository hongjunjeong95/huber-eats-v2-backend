import { DynamicModule, Global, Module } from '@nestjs/common';

import { CONFIG_OPTIONS } from '@apis/common/common.constants';
import { MailModuleOptions } from '@mail/mail.interfaces';
import { MailService } from '@mail/mail.service';

@Global()
@Module({})
export class MailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: MailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        MailService,
      ],
      exports: [MailService],
    };
  }
}
