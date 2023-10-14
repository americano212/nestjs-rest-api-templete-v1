import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './common';

@Controller()
export class AppController {
  constructor(private config: ConfigService) {}

  @Get()
  // @Roles(Role.User)
  healthCheck(): string {
    return `${this.config.get('db.host')}`;
  }
}
