import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LocalRegisterDto, addRoleDto } from './dto';
import { UsersRepository } from './user.repository';
import { UtilService } from '../../common';
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
    const { password, ...userWithoutPassword } = userData;
    const passwordHash = await this.util.passwordEncoding(password);
    try {
      const user = await this.usersRepository.create({
        passwordHash,
        ...userWithoutPassword,
      });
      const roles = userWithoutPassword.roles;
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

  public async addRole(data: addRoleDto): Promise<boolean> {
    const user = await this.usersRepository.getByUserId(data.user_id);
    if (!user) return false;
    return await this.role.addRoleToUser(data.role_name, user);
  }
}
