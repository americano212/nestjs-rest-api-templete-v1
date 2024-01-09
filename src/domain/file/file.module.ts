import { Module } from '@nestjs/common';
import { FileController } from './file.controller';

import * as providers from './providers';

const services = Object.values(providers);

@Module({
  controllers: [FileController],
  providers: services,
  exports: services,
})
export class FileModule {}
