import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '#entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) {}

  public async findRoleByName(roleName: string): Promise<Role> {
    let role: Role | null;
    role = await this.rolesRepository.findOneBy({
      role_name: roleName,
    });
    if (!role) role = await this.rolesRepository.save({ role_name: roleName });

    return role;
  }
}
