import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { UsersRepository } from './user.repository';
import { RoleService } from '../role/providers';
import { UtilService } from '../../common';
import { LocalRegisterDto, AddRoleDto } from './dto';

export enum MysqlErrorCode {
  ALREADY_USER = 'ER_DUP_ENTRY',
}

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly util: UtilService,
    private readonly role: RoleService,
  ) {}

  @Transactional()
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
        const isSuccess = await this.role.addRoleToUser(role_name, user);
        if (!isSuccess) throw new NotFoundException(`The role ${role_name} is not valid role`);
      }
      return true;
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        if (error?.driverError.code === MysqlErrorCode.ALREADY_USER)
          throw new HttpException(`User's Email already exists`, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof NotFoundException) {
        const message = error?.message;
        throw new HttpException(message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('UNKNOWN ERROR', HttpStatus.BAD_REQUEST);
    }
  }

  public async addRole(data: AddRoleDto): Promise<boolean> {
    try {
      const user_id = data.user_id;
      const role_name = data.role_name;
      const user = await this.usersRepository.getByUserId(user_id);
      if (!user) throw new NotFoundException(`User ID ${user_id} does NOT Exist`);
      const isSuccess = await this.role.addRoleToUser(role_name, user);
      if (!isSuccess) throw new NotFoundException(`The role ${role_name} is not valid role`);
      return isSuccess;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        const message = error?.message;
        throw new HttpException(message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('UNKNOWN ERROR', HttpStatus.BAD_REQUEST);
    }
  }
}
