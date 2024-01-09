import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ApiFile } from './decorators';
import { FileService } from './providers/file.service';

@ApiTags('file')
@Controller('upload')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @Post('s3')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.fileService.uploadSingleFile(file);
    console.log('result.co', result);
    return result;
  }
}
