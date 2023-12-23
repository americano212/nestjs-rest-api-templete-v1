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

  public async create(userRoleData: CreateUserRoleDto): Promise<UserRole | null> {
    const user_role = await this.userRolesRepository.save(userRoleData);
    return user_role;
  }

  public async findAllByUserId(user_id: number): Promise<UserRole[]> {
    const result = await this.userRolesRepository.find({
      relations: { user: true, role: true },
      where: { user: { user_id: user_id } },
    });
    return result;
  }
}
