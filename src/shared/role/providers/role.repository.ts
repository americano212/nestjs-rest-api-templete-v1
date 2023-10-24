import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '#entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) {}

  public async findRoleByName(roleName: string): Promise<Role | undefined> {
    const role = await this.rolesRepository.upsert({ role_name: roleName }, [
      'role_name',
    ]);
    if (!role) return undefined;
    return role;
  }
}
