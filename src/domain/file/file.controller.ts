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
    const awsRegion = this.config.get('aws.region');
    AWS.config.update({
      region: awsRegion,
      credentials: {
        accessKeyId: this.config.get('aws.accessKey'),
        secretAccessKey: this.config.get('aws.secretKey'),
      },
    });
    const BUCKET_NAME = this.config.get('aws.s3.bucketName');
    console.log('file', file);
    try {
      const key = `${Date.now().toString()}-${file.originalname}`;
      const upload = await new AWS.S3()
        .putObject({
          Key: key,
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          ACL: 'public-read',
        })
        .promise();
      const urlHead = `https://${BUCKET_NAME}.s3.${awsRegion}.amazonaws.com/`; // TODO replace CDN
      console.log('upload', upload);
      console.log('url', urlHead + key);
    } catch (error) {
      console.log('error', error);
    }
  }
}
