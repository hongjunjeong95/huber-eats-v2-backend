import { DynamicModule, Global, Module } from '@nestjs/common';

import { CONFIG_OPTIONS } from '@apis/common/common.constants';
import { UploadController } from '@uploads/upload.controller';
import { UploadsModuleOptions } from '@uploads/upload.interfaces';

@Module({
  controllers: [UploadController],
})
@Global()
export class UploadsModule {
  static forRoot(options: UploadsModuleOptions): DynamicModule {
    return {
      module: UploadsModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        UploadController,
      ],
    };
  }
}
