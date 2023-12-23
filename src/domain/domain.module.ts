import { Module } from '@nestjs/common';
import { BoardModule } from './board';

@Module({
  imports: [BoardModule],
})
export class DomainModule {}
