import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck(): string {
    return 'Hello World';
  }

  @Get('/favicon.ico')
  @HttpCode(204)
  faviconCheck(): void {}
}
