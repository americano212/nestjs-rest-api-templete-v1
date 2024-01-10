import { Injectable, NotFoundException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { User } from '#entities/user.entity';

import { UsersRepository } from './user.repository';
import { RoleService } from '../role/providers';
import { UtilService } from '../../common';
import { LocalRegisterDto, GiveRoleToUserDto } from './dto';
import { SNSUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly util: UtilService,
    private readonly role: RoleService,
  ) {}

  @Transactional()
  public async createLocalUser(userData: LocalRegisterDto): Promise<User> {
    const { password, ...userWithoutPassword } = userData;
    const passwordHash = await this.util.passwordEncoding(password);
    const user = await this.usersRepository.create({
      passwordHash,
      ...userWithoutPassword,
    });
    return user;
  }

  public async createSNSUser(snsUserData: SNSUserDto): Promise<User> {
    const user = await this.usersRepository.create(snsUserData);
    return user;
  }

  @Transactional()
  public async giveRole(giveRoleData: GiveRoleToUserDto): Promise<boolean> {
    const { userId, roleName } = giveRoleData;

    const user = await this.usersRepository.findOne(userId);
    if (!user) throw new NotFoundException(`User ID ${userId} NOT Found`);

    const isSuccess = await this.role.giveRoleToUser(roleName, user);
    if (!isSuccess) throw new NotFoundException(`The role '${roleName}' invalid role`);
    return isSuccess;
  }

  public async isExistEmail(email: string): Promise<boolean> {
    return await this.usersRepository.isExistEmail(email);
  }
}
