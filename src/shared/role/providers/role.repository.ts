import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '#entities/role.entity';

import { NullableType } from 'src/common/types';

@Injectable()
export class RolesRepository {
  constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>) {}

  public async create(roleName: string): Promise<Role> {
    return await this.rolesRepository.create({ role_name: roleName });
  }

  public async findRoleByName(roleName: string): Promise<NullableType<Role>> {
    return await this.rolesRepository.findOneBy({ role_name: roleName });
  }
}
