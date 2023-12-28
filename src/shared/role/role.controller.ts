import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Role, Roles } from '../../../src/common';
import { CreateRoleDto } from './dto';
import { RoleService } from './providers';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly role: RoleService) {}

  @ApiBearerAuth()
  @Roles(Role.Test)
  @Get('/test')
  roleCheck(): string {
    return 'Hello World';
  }

  @Post()
  public async create(@Body() roledata: CreateRoleDto): Promise<boolean> {
    const isSuccess = await this.role.create(roledata);
    return isSuccess;
  }
}
