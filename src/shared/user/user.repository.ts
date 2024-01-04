import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '#entities/user.entity';

import { CreateUserDto } from './dto';
import { NullableType } from 'src/common/types';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  public async create(userData: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(await this.usersRepository.create(userData));
  }

  public async findOne(userId: number): Promise<NullableType<User>> {
    return await this.usersRepository.findOne({
      relations: { roles: true },
      where: { user_id: userId },
    });
  }

  public async findOneByEmail(email: string): Promise<NullableType<User>> {
    return await this.usersRepository.findOne({
      relations: { roles: true },
      where: { email: email },
      select: {
        user_id: true,
        username: true,
        email: true,
        vendor: true,
        social_id: true,
        passwordHash: true,
        roles: { role_name: true },
      },
    });
  }

  public async isExistUsername(username: string): Promise<boolean> {
    return await this.usersRepository.exist({ where: { username: username } });
  }

  public async isExistEmail(email: string): Promise<boolean> {
    return await this.usersRepository.exist({ where: { email: email } });
  }

  public async setRefreshToken(userId: number, token: string): Promise<boolean> {
    const result = await this.usersRepository.update({ user_id: userId }, { refreshToken: token });
    return result.affected ? true : false;
  }
}
