import { Module } from '@nestjs/common';
import * as controllers from './controllers';

@Module({
  controllers: Object.values(controllers),
})
export class BaseModule {}
