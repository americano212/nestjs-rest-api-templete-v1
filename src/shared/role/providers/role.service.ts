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
  // TODO addRole 추가
  public async addRoleToUser(role_name: string, user: User): Promise<boolean> {
    try {
      // TODO role이 없을 때
      const role = await this.rolesRepository.findRoleByName(role_name);
      await this.userRolesRepository.create({ user, role });
      return true;
    } catch (error) {
      // TODO exception 처리 필요
      console.log(error);
      return false;
    }
  }
}
