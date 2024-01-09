import { Module } from '@nestjs/common';
import { FileService } from './providers/file.service';
import { FileController } from './file.controller';

@Module({
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
