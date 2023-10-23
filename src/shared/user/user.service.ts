import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { LocalRegisterDto, UserDto } from './dto';
import { UsersRepository } from './user.repository';
import { UtilService } from 'src/common';
import { RolesRepository, UserRolesRepository } from '../role/providers';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly userRolesRepository: UserRolesRepository,
    private readonly util: UtilService,
  ) {}

  public async create(userData: LocalRegisterDto): Promise<boolean> {
    // TODO Check logic for already exist user
    const { password, ...userDataExceptPassword } = userData;
    const passwordHash = await this.util.passwordEncoding(password);

    const user = await this.usersRepository.create({
      passwordHash,
      ...userDataExceptPassword,
    });
    // Role도 같이 연결해주는 로직 필요
    const roles_data = userData.roles;
    for (const role_data in roles_data) {
      const role = await this.rolesRepository.findRoleByName(role_data);
      const user_role = await this.userRolesRepository.create({ user, role });
      console.log(user_role);
    }

    // TODO 리턴값 고민 필요.
    return true;
  }

  public async getByUsername(username: string): Promise<UserDto | null> {
    const user = await this.usersRepository.getByUsername(username);
    return user;
  }

  public async fetch(user_id: number): Promise<UserDto & { roles: string[] }> {
    const saltOrRounds = 10;
    const password = 'test_password';
    const hash = await bcrypt.hash(password, saltOrRounds);
    return Promise.resolve({
      user_id: user_id,
      username: 'test_user',
      passwordHash: hash,
      email: 'testUser@test.com',
      roles: ['Admin'],
    });
  }
}
