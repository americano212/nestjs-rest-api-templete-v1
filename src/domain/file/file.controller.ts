import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { ApiFile } from './decorators';
import { FileService } from './providers/file.service';
import { UploadFile } from '#entities/file';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<UploadFile> {
    return await this.fileService.uploadSingleFile(file);
  }
}
