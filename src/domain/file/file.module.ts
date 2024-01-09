import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadFile } from '#entities/file';

import { FileController } from './file.controller';
import * as providers from './providers';

const services = Object.values(providers);

@Module({
  imports: [TypeOrmModule.forFeature([UploadFile])],
  controllers: [FileController],
  providers: services,
  exports: services,
})
export class FileModule {}
