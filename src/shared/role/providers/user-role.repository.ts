import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRole } from '#entities/user-role.entity';
import { CreateUserRoleDto } from '../dto';

@Injectable()
export class UserRolesRepository {
  constructor(
    @InjectRepository(UserRole)
    private userRolesRepository: Repository<UserRole>,
  ) {}

  public async create(userRoleData: CreateUserRoleDto) {
    console.log(userRoleData);
    // TODO 만약 role이 없다면 자동으로 생성하는 로직
    const user_role = await this.userRolesRepository.save(userRoleData);
    return user_role;
  }
}
