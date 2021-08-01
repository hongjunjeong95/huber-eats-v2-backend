import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { UploadController } from './upload.controller';
import { UploadsModuleOptions } from './upload.interfaces';

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
