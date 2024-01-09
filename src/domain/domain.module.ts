import { Module } from '@nestjs/common';
import { BoardModule } from './board';
import { FileModule } from './file/file.module';

@Module({
  imports: [BoardModule, FileModule],
})
export class DomainModule {}
