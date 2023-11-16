import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, LocalRegisterDto, addRoleDto } from './dto';
import { UsersRepository } from './user.repository';
import { UtilService } from '../../common';
import { QueryFailedError } from 'typeorm';
import { RoleService } from '../role/providers';
import { Transactional } from 'typeorm-transactional';

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
      const result = await this.createUserAndApplyRole({
        passwordHash,
        ...userWithoutPassword,
      });
      return result;
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        if (error?.driverError.code === MysqlErrorCode.ALREADY_USER)
          throw new HttpException(
            `User's Email already exists`,
            HttpStatus.BAD_REQUEST,
          );
      }
      if (error instanceof NotFoundException) {
        const message = error?.message;
        throw new HttpException(message, HttpStatus.BAD_REQUEST);
      }
      return false;
    }
  }

  @Transactional()
  private async createUserAndApplyRole(
    createUserData: CreateUserDto,
  ): Promise<boolean> {
    const user = await this.usersRepository.create(createUserData);
    const roles = createUserData.roles;
    for (let i = 0; i < roles?.length; i++) {
      const role_name = roles[i];
      const isSuccess = await this.role.addRoleToUser(role_name, user);
      if (!isSuccess)
        throw new NotFoundException(`The role ${role_name} is not valid role`);
    }
    return true;
  }

  public async addRole(data: addRoleDto): Promise<boolean> {
    const user = await this.usersRepository.getByUserId(data.user_id);
    if (!user) return false;
    return await this.role.addRoleToUser(data.role_name, user);
  }
}
