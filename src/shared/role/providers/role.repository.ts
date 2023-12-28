import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '#entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>) {}

  public async create(roleName: string): Promise<Role> {
    const role = await this.rolesRepository.save({ role_name: roleName });
    return role;
  }

  public async findRoleByName(roleName: string): Promise<Role | null> {
    const role = await this.rolesRepository.findOneBy({ role_name: roleName });
    return role ? role : null;
  }
}
