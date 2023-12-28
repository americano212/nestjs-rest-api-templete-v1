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

  public async create(userRoleData: CreateUserRoleDto): Promise<UserRole> {
    const userRole = await this.userRolesRepository.save(userRoleData);
    return userRole;
  }

  public async findAllByUserId(userId: number): Promise<UserRole[]> {
    const userRoles = await this.userRolesRepository.find({
      relations: { user: true, role: true },
      where: { user: { user_id: userId } },
    });
    return userRoles;
  }
}
