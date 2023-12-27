import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { UsersRepository } from './user.repository';
import { RoleService } from '../role/providers';
import { UtilService } from '../../common';
import { LocalRegisterDto, AddRoleToUserDto } from './dto';
import { SNSUser, User } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly util: UtilService,
    private readonly role: RoleService,
  ) {}

  @Transactional()
  public async create(userData: LocalRegisterDto): Promise<User> {
    const { password, ...userWithoutPassword } = userData;
    const passwordHash = await this.util.passwordEncoding(password);
    return await this.usersRepository.create({
      passwordHash,
      ...userWithoutPassword,
    });
  }

  public async createSNSUser(snsUser: SNSUser): Promise<User> {
    return await this.usersRepository.create(snsUser);
  }

  public async addRole(data: AddRoleToUserDto): Promise<boolean> {
    const { user_id, role_name } = data;
    const user = await this.usersRepository.getByUserId(user_id);
    if (!user) throw new NotFoundException(`User ID ${user_id} does NOT Exist`);
    const isSuccess = await this.role.addRoleToUser(role_name, user);
    if (!isSuccess) throw new NotFoundException(`The role ${role_name} is not valid role`);
    return isSuccess;
  }

  public async isExistEmail(email: string): Promise<boolean> {
    const user = await this.usersRepository.getByEmail(email);
    return user ? true : false;
  }
}
