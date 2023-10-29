import { User } from '#entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { CreateUserDto, UserDto } from './dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  public async create(userData: CreateUserDto): Promise<User> {
    console.log(userData);
    const user = await this.usersRepository.save(userData);
    return user;
  }

  public async getByUserId(user_id: number): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ user_id });
    return user;
  }

  public async getByEmail(email: string): Promise<UserDto> {
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.user_id AS user_id',
        'user.username AS username',
        'user.passwordHash AS passwordHash',
        'user.email AS email',
        'role.role_name AS role_name',
      ])
      .leftJoin('user.roles', 'user_role')
      .leftJoin('user_role.role', 'role')
      .where('user.email = :email', { email })
      .getRawMany();

    const user: UserDto = {
      user_id: result[0].user_id,
      username: result[0].username,
      passwordHash: result[0].passwordHash,
      email: result[0].email,
    };
    const roles = [];
    for (let i = 0; i < result.length; i++) {
      roles.push(result[i].role_name);
    }
    user.roles = roles;
    return user;
  }

  public async isExistUsername(username: string): Promise<boolean> {
    const findOptions: FindManyOptions = {
      where: {
        username: username,
      },
    };
    const isExist = await this.usersRepository.exist(findOptions);
    return isExist;
  }

  public async isExistEmail(email: string): Promise<boolean> {
    const findOptions: FindManyOptions = {
      where: {
        email: email,
      },
    };
    const isExist = await this.usersRepository.exist(findOptions);
    return isExist;
  }

  public async setRefreshToken(
    user_id: number,
    token: string,
  ): Promise<boolean> {
    const updateResult = await this.usersRepository.update(
      { refreshToken: token },
      { user_id },
    );
    if (updateResult.affected === 0) return false;
    return true;
  }
}
