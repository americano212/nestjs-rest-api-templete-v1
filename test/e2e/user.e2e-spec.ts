import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import supertest from 'supertest';
import type { Express } from 'express';
import { Repository } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { User } from '#entities/user.entity';

import { AppModule } from 'src/app.module';
import { middleware } from 'src/app.middleware';
import { ValidationException } from 'src/common/exceptions';
import { GiveRoleToUserDto, LocalRegisterDto } from 'src/shared/user/dto';
import { Role } from 'src/common';
import { LocalLoginDto } from 'src/base/dto';

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
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (errors) => new ValidationException(errors),
        transform: true,
      }),
    );
    await app.init();
    request = supertest(app.getHttpServer());

    userRepository = moduleRef.get('UserRepository');
  });

  const email = 'test@example.com';
  const username = 'username';
  const password = 'test1234';

  const superAdminLoginData: LocalLoginDto = {
    email: process.env['SUPER_ADMIN_EMAIL'] || '',
    password: process.env['SUPER_ADMIN_PASSWORD'] || '',
  };

  test('POST: /user/register [201] Successfully Register', async () => {
    const localRegisterData: LocalRegisterDto = { email, username, password };
    const { status, body } = await request.post('/user/register').send(localRegisterData);

    expect([201]).toContain(status);
    expect(body).toHaveProperty('email', email);
    expect(body).toHaveProperty('username', username);
  });

  test('POST: /user/register [400] Invalid Email Format', async () => {
    const invalidEmailFormat = 'hello world';
    const localRegisterData: LocalRegisterDto = { email: invalidEmailFormat, username, password };
    const { status, body } = await request.post('/user/register').send(localRegisterData);

    expect([400]).toContain(status);
    expect(body).toHaveProperty('message', 'Validation Exception');
  });

  test('POST: /user/role [201] Successfully give role to user', async () => {
    const superAdminLogin = await request.post('/login').send(superAdminLoginData);
    const superAdminToken = superAdminLogin.body.accessToken;

    const giveRoleToUserData: GiveRoleToUserDto = { userId: 1, roleName: Role.Test };
    const { status, body } = await request
      .post('/user/role')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send(giveRoleToUserData);

    expect([201]).toContain(status);
    expect(body).toHaveProperty('isSuccess', true);
  });

  test(`POST: /user/role [403] Unauthorized user's request`, async () => {
    const giveRoleToUserData: GiveRoleToUserDto = { userId: 1, roleName: Role.Test };
    const { status } = await request.post('/user/role').send(giveRoleToUserData);

    expect([403]).toContain(status);
  });

  test('POST: /user/role [404] Not exist user', async () => {
    const superAdminLogin = await request.post('/login').send(superAdminLoginData);
    const superAdminToken = superAdminLogin.body.accessToken;

    const invalidUserId = -1;
    const giveRoleToUserData: GiveRoleToUserDto = { userId: invalidUserId, roleName: Role.Test };
    const { status } = await request
      .post('/user/role')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send(giveRoleToUserData);

    expect([404]).toContain(status);
  });

  afterAll(async () => {
    await app?.close();
  });

  afterEach(async () => {
    await userRepository.query(`DELETE FROM user WHERE email='${email}'`);
  });
});
