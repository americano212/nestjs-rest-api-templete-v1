import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateRoleDto } from './dto';
import { RoleService } from './providers';
import { SuccessResponseDto } from 'src/common/dto';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly role: RoleService) {}

  @Post()
  public async create(@Body() roledata: CreateRoleDto): Promise<SuccessResponseDto> {
    return { isSuccess: await this.role.create(roledata) };
  }
}
