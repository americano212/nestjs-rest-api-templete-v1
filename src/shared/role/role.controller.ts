import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Role as RoleEntity } from '#entities/role.entity';

import { CreateRoleDto } from './dto';
import { RoleService } from './providers';
import { Role, Roles } from 'src/common';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly role: RoleService) {}

  @Roles(Role.SuperAdmin)
  @Post()
  public async create(@Body() createRoledata: CreateRoleDto): Promise<RoleEntity> {
    return await this.role.create(createRoledata);
  }
}
