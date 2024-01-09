import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
