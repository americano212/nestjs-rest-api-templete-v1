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

  public async getByEmail(email: string): Promise<UserDto | null> {
    // TODO 이중 join문으로 변경
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.user_id',
        'user.username',
        'user.passwordHash',
        'user.email',
      ])
      .addSelect('roles.role_name', 'roles')
      .innerJoin('user.roles', 'roles')
      .where('user.email = :email', { email })
      .getRawOne();
    // TODO Join으로 roles 가져오기
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
}
