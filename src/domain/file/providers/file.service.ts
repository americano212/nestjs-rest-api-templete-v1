import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/common';
import * as AWS from 'aws-sdk';
import { UploadFileDto } from '../dto';
import { FilesRepository } from './file.repository';

@Injectable()
export class FileService {
  constructor(
    private readonly config: ConfigService,
    private readonly filesRepository: FilesRepository,
  ) {}

  public async uploadSingleFile(file: Express.Multer.File) {
    console.log(file); // TODO file === undefined Exception
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
    console.log('uploadFileS3', uploadFileS3);
    // TODO replace CDN
    const urlHead = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/`;
    const url = urlHead + key;
    console.log('url', urlHead + key);

    //TODO upload RDS
    const uploadFileData: UploadFileDto = {
      originalName: file.originalname,
      url: url,
      size: file.size,
      encoding: file.encoding, // TODO aws-sdk version Check
      mimeType: file.mimetype,
    };
    console.log('uploadFileData', uploadFileData);
    const result = await this.filesRepository.create(uploadFileData);
    return { result, url };
  }
}
