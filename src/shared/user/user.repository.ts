import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '#entities/user.entity';

import { CreateUserDto } from './dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  public async create(userData: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.save(await this.usersRepository.create(userData));
    return user;
  }

  public async getByUserId(userId: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      relations: { roles: true },
      where: { user_id: userId },
    });
    return user ? user : null;
  }

  public async getByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
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
    console.log('user.repo', user);
    return user;
  }

  public async isExistUsername(username: string): Promise<boolean> {
    const isExist = await this.usersRepository.exist({ where: { username: username } });
    return isExist;
  }

  public async isExistEmail(email: string): Promise<boolean> {
    const isExist = await this.usersRepository.exist({ where: { email: email } });
    return isExist;
  }

  public async setRefreshToken(userId: number, token: string): Promise<boolean> {
    const updateResult = await this.usersRepository.update(userId, {
      refreshToken: token,
    });
    return updateResult.affected === 1 ? true : false;
  }
}
