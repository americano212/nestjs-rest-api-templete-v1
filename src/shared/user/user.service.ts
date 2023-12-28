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
    const user = await this.usersRepository.create({
      passwordHash,
      ...userWithoutPassword,
    });
    return user;
  }

  public async createSNSUser(snsUser: SNSUser): Promise<User> {
    const user = await this.usersRepository.create(snsUser);
    return user;
  }

  public async addRole(addRoleData: AddRoleToUserDto): Promise<boolean> {
    const { user_id, role_name } = addRoleData;

    const user = await this.usersRepository.getByUserId(user_id);
    if (!user) throw new NotFoundException(`User ID ${user_id} NOT Found`);

    const isSuccess = await this.role.addRoleToUser(role_name, user);
    if (!isSuccess) throw new NotFoundException(`The role '${role_name}' invalid role`);

    return isSuccess;
  }

  public async isExistEmail(email: string): Promise<boolean> {
    const user = await this.usersRepository.getByEmail(email);
    return user ? true : false;
  }
}
