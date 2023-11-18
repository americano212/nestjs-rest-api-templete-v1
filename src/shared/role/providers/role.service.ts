import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { User } from '#entities/user.entity';

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
      if (!role) throw new NotFoundException(`The role ${role_name} is not valid role`);
      const user_role = await this.userRolesRepository.create({ user, role });
      if (!user_role) throw new Error();
      return true;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        const message = error?.message;
        throw new HttpException(message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('UNKNOWN ERROR', HttpStatus.BAD_REQUEST);
    }
  }
}
