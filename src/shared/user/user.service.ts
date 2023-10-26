import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { LocalRegisterDto, UserDto } from './dto';
import { UsersRepository } from './user.repository';
import { UtilService } from 'src/common';
import { RolesRepository, UserRolesRepository } from '../role/providers';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly userRolesRepository: UserRolesRepository,
    private readonly util: UtilService,
  ) {}

  public async create(userData: LocalRegisterDto): Promise<boolean> {
    // TODO 트랜잭션 처리 필요
    const { password, ...userDataExceptPassword } = userData;
    const passwordHash = await this.util.passwordEncoding(password);

    try {
      const user = await this.usersRepository.create({
        passwordHash,
        ...userDataExceptPassword,
      });

      console.log('user', user);
      const roles = userData.roles;
      console.log(roles);
      // TODO addRole로 때어내기
      // TODO role이 없을 때
      for (let i = 0; i < roles?.length; i++) {
        const role_name = roles[i];
        const role = await this.rolesRepository.findRoleByName(role_name);
        const user_role = await this.userRolesRepository.create({ user, role });
        console.log('user_role', user_role);
      }
      // TODO 리턴값 고민 필요.
      return true;
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        console.log('errno', error?.driverError.code);
        throw new HttpException('사용자 이미 존재', HttpStatus.BAD_REQUEST);
      }
      return false;
    }
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
