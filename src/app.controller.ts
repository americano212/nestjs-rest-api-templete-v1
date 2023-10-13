import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './common';

@Controller()
export class AppController {
  constructor(private config: ConfigService) {}

  @Get()
  healthCheck(): string {
    return `${this.config.get('db.host')}`;
  }
}
