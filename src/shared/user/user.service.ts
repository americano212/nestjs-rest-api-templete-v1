import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { LocalRegisterDto, UserDto } from './dto';
import { UsersRepository } from './user.repository';
import { UtilService } from 'src/common';
import { QueryFailedError } from 'typeorm';
import { RoleService } from '../role/providers';

enum MysqlErrorCode {
  ALREADY_USER = 'ER_DUP_ENTRY',
}

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly util: UtilService,
    private readonly role: RoleService,
  ) {}

  public async create(userData: LocalRegisterDto): Promise<boolean> {
    const { password, ...userDataExceptPassword } = userData;
    const passwordHash = await this.util.passwordEncoding(password);
    try {
      const user = await this.usersRepository.create({
        passwordHash,
        ...userDataExceptPassword,
      });
      const roles = userData.roles;
      for (let i = 0; i < roles?.length; i++) {
        const role_name = roles[i];
        await this.role.addRoleToUser(role_name, user);
      }
      return true;
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        if (error?.driverError.code === MysqlErrorCode.ALREADY_USER)
          throw new HttpException(
            `User's Email already exists`,
            HttpStatus.BAD_REQUEST,
          );
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
