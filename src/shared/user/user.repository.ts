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

  public async create(userData: CreateUserDto): Promise<UserDto> {
    const user = await this.usersRepository.save(userData);
    return user;
  }

  public async getByUsername(username: string): Promise<UserDto | null> {
    const user = await this.usersRepository.findOneBy({ username });
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
