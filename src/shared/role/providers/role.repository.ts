import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '#entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>) {}

  public async create(role_name: string): Promise<Role | null> {
    const isRoleExist = await this.findRoleByName(role_name);
    if (!isRoleExist) {
      const role = await this.rolesRepository.save({ role_name });
      return role;
    }
    return null;
  }

  public async findRoleByName(role_name: string): Promise<Role | null> {
    const role = await this.rolesRepository.findOneBy({
      role_name: role_name,
    });
    if (!role) return null;
    return role;
  }
}
