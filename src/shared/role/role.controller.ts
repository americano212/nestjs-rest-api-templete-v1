import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Role, Roles } from '../../../src/common';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  @Roles(Role.Test)
  @Get('/test')
  roleCheck(): string {
    return 'Hello World';
  }
}
