import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  // @Roles(Role.User)
  healthCheck(): string {
    return 'Hello World';
  }
}
