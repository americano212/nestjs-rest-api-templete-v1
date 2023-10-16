import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './common';
import { stringify } from 'querystring';

@Controller()
export class AppController {
  constructor(private config: ConfigService) {}

  @Get()
  // @Roles(Role.User)
  healthCheck(): string {
    return `${stringify(this.config.get('db'))}`;
  }
}
