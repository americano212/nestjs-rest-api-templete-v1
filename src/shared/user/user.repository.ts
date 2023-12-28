import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User as UserEntity } from '#entities/user.entity';

import { CreateUserDto } from './dto';
import { User } from './user.interface';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) {}

  public async create(userData: CreateUserDto): Promise<UserEntity> {
    const user = await this.usersRepository.save(userData);
    delete user.passwordHash;
    return user;
  }

  public async getByUserId(userId: number): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOne({
      relations: { roles: true },
      where: { user_id: userId },
    });
    return user ? user : null;
  }

  public async getByEmail(email: string): Promise<User | null> {
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.user_id AS user_id',
        'user.username AS username',
        'user.passwordHash AS passwordHash',
        'user.email AS email',
        'user.vendor AS vendor',
        'user.social_id AS social_id',
        'role.role_name AS role_name',
      ])
      .leftJoin('user.roles', 'user_role')
      .leftJoin('user_role.role', 'role')
      .where('user.email = :email', { email })
      .getRawMany();
    if (!result.length) return null;
    const user: User = {
      user_id: result[0].user_id,
      username: result[0].username,
      passwordHash: result[0].passwordHash,
      email: result[0].email,
      vendor: result[0].vendor,
      social_id: result[0].social_id,
      roles: [],
    };
    const roles = [];
    for (let i = 0; i < result.length; i++) {
      roles.push(result[i].role_name);
    }
    user.roles = roles;
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
