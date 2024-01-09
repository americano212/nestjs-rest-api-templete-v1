import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ApiFile } from './decorators';

@ApiTags('file')
@Controller('file')
export class FileController {
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
  }
}
