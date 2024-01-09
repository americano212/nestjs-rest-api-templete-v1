import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as AWS from 'aws-sdk';

import { ApiFile } from './decorators';
import { ConfigService } from 'src/common';

@ApiTags('file')
@Controller('upload')
export class FileController {
  constructor(private readonly config: ConfigService) {}

  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @Post('s3')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    AWS.config.update({
      region: this.config.get('aws.region'),
      credentials: {
        accessKeyId: this.config.get('aws.accessKey'),
        secretAccessKey: this.config.get('aws.secretKey'),
      },
    });
    const BUCKET_NAME = this.config.get('aws.s3.bucketName');
    console.log('file', file);
    try {
      const upload = await new AWS.S3()
        .putObject({
          Key: `${Date.now() + file.originalname}`,
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          ACL: 'public-read',
        })
        .promise();
      console.log('upload', upload);
    } catch (error) {
      console.log('error', error);
    }
  }
}
