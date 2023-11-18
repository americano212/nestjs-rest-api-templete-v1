import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '#entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>) {}

  public async findRoleByName(roleName: string): Promise<Role | null> {
    const role = await this.rolesRepository.findOneBy({
      role_name: roleName,
    });
    if (!role) return null;
    return role;
  }
}
