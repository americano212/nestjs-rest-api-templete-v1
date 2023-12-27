import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User } from '#entities/user.entity';

import { RolesRepository } from './role.repository';
import { UserRolesRepository } from './user-role.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly userRolesRepository: UserRolesRepository,
  ) {}

  public async create(role_name: string): Promise<boolean> {
    const role = await this.rolesRepository.create(role_name);
    if (!role) throw new ConflictException(`The role '${role_name}' already exist`);
    return true;
  }

  public async addRoleToUser(role_name: string, user: User): Promise<boolean> {
    const role = await this.rolesRepository.findRoleByName(role_name);
    if (!role) throw new NotFoundException(`The role ${role_name} is not valid role`);
    const user_roles: string[] = [];
    user.roles?.forEach((user_role) => {
      user_roles.push(user_role.role_name);
    });
    const isExistRoleToUser = user_roles.includes(role_name);
    if (isExistRoleToUser)
      throw new BadRequestException(
        `The role ${role_name} already exist role to user ${user.user_id}`,
      );
    const user_role = await this.userRolesRepository.create({ user, role, role_name });
    if (!user_role) throw new Error();
    return true;
  }
}
