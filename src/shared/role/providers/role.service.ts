import { User } from '#entities/user.entity';
import { Injectable } from '@nestjs/common';
import { RolesRepository } from './role.repository';
import { UserRolesRepository } from './user-role.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly userRolesRepository: UserRolesRepository,
  ) {}

  public async addRoleToUser(role_name: string, user: User): Promise<boolean> {
    try {
      const role = await this.rolesRepository.findRoleByName(role_name);
      if (!role) return false;
      await this.userRolesRepository.create({ user, role });
      return true;
    } catch (error) {
      return false;
    }
  }
}
