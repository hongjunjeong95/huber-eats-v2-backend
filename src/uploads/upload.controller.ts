import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

import { CONFIG_OPTIONS } from '@apis/common/common.constants';
import { UploadsModuleOptions } from '@uploads/upload.interfaces';

const BUCKET_NAME = 'huber-eats-v2';

@Controller('uploads')
export class UploadController {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: UploadsModuleOptions,
  ) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.options.accessKeyId,
        secretAccessKey: this.options.secretAccessKey,
      },
    });

    try {
      const objectName = `${Date.now() + file.originalname}`;
      await new AWS.S3()
        .putObject({
          Bucket: BUCKET_NAME,
          Key: objectName,
          ACL: 'public-read',
          Body: file.buffer,
        })
        .promise();
      const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
      return { url };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
