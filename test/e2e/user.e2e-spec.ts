import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Express } from 'express';

import { AppModule } from '../../src/app.module';
import { GiveRoleToUserDto, LocalRegisterDto } from '../../src/shared/user/dto';
import { initializeTransactionalContext } from 'typeorm-transactional';
import supertest from 'supertest';
import { Repository } from 'typeorm';
import { User } from '#entities/user.entity';
import { Role } from 'src/common';
import { LocalLoginDto } from 'src/base/dto';
import { middleware } from 'src/app.middleware';

describe('user', () => {
  let app: INestApplication<Express> | undefined;
  let request: supertest.SuperTest<supertest.Test>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    initializeTransactionalContext();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    middleware(app);
    await app.init();
    request = supertest(app.getHttpServer());

    userRepository = moduleRef.get('UserRepository');
  });

  const email = 'test@example.com';
  const username = 'test username';
  const password = 'test1234';

  test('POST: /user/register', async () => {
    const localRegisterData: LocalRegisterDto = { email, username, password };
    const { status, body } = await request.post('/user/register').send(localRegisterData);

    expect([200, 201]).toContain(status);
    expect(body).toHaveProperty('email', email);
    expect(body).toHaveProperty('username', username);
  });

  test('POST: /user/role', async () => {
    const localLoginData: LocalLoginDto = {
      email: process.env['SUPER_ADMIN_EMAIL'] || '',
      password: process.env['SUPER_ADMIN_PASSWORD'] || '',
    };
    const superAdminLogin = await request.post('/login').send(localLoginData);
    const token = superAdminLogin.body.accessToken;

    const giveRoleToUserData: GiveRoleToUserDto = { userId: 1, roleName: Role.Test };
    const { status, body } = await request
      .post('/user/role')
      .set('Authorization', `Bearer ${token}`)
      .send(giveRoleToUserData);

    expect([200, 201]).toContain(status);
    expect(body).toHaveProperty('isSuccess', true);
  });

  afterAll(async () => {
    await app?.close();
  });

  afterEach(async () => {
    await userRepository.query(`DELETE FROM user WHERE email='${email}'`);
  });
});
