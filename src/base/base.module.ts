import { Module } from '@nestjs/common';

import * as controllers from './controllers';

@Module({
  imports: [],
  controllers: Object.values(controllers),
})
export class BaseModule {}
