import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

import { UploadFile } from '#entities/file';

import { ConfigService } from 'src/common';
import { UploadFileDto } from '../dto';
import { FilesRepository } from './file.repository';

@Injectable()
export class FileService {
  constructor(
    private readonly config: ConfigService,
    private readonly filesRepository: FilesRepository,
  ) {}

  public async uploadSingleFile(file: Express.Multer.File): Promise<UploadFile> {
    if (!file) throw new BadRequestException('File is not Exist');

    const awsRegion = this.config.get('aws.region');
    const bucketName = this.config.get('aws.s3.bucketName');
    AWS.config.update({
      region: awsRegion,
      credentials: {
        accessKeyId: this.config.get('aws.accessKey'),
        secretAccessKey: this.config.get('aws.secretKey'),
      },
    });

    const key = `${Date.now().toString()}-${file.originalname}`;
    const uploadFileS3 = await new AWS.S3()
      .putObject({
        Key: key,
        Body: file.buffer,
        Bucket: bucketName,
        ACL: 'public-read',
      })
      .promise();
    if (!uploadFileS3.ETag) throw new BadRequestException('Failed upload File');

    // TODO replace CDN
    const url = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/` + key;

    const uploadFileData: UploadFileDto = {
      originalName: file.originalname,
      url: url,
      size: file.size,
      encoding: file.encoding, // TODO aws-sdk version Check
      mimeType: file.mimetype,
    };

    return await this.filesRepository.create(uploadFileData);
  }
}
