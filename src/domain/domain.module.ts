import { Module } from '@nestjs/common';
import { BoardModule } from './board';
import { FilesModule } from './files/files.module';

@Module({
  imports: [BoardModule, FilesModule],
})
export class DomainModule {}
