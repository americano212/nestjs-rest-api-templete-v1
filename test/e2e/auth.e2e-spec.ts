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
import { LocalLoginDto } from 'src/base/dto';
import { LocalRegisterDto } from 'src/shared/user/dto';

describe('auth', () => {
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

  test('POST: /login [201] Successfully login', async () => {
    const localRegisterData: LocalRegisterDto = { email, username, password };
    const registerResult = await request.post('/user/register').send(localRegisterData);

    expect([201]).toContain(registerResult.status);

    const localLoginData: LocalLoginDto = { email, password };
    const { status, body } = await request.post('/login').send(localLoginData);

    expect([201]).toContain(status);
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
  });

  test('POST: /login [401] Not exist email', async () => {
    const notExistEmail = 'wrong@email.com';
    const localLoginData: LocalLoginDto = { email: notExistEmail, password };
    const { status } = await request.post('/login').send(localLoginData);

    expect([401]).toContain(status);
  });

  test('POST: /login [401] Wrong password', async () => {
    const wrongPassword = 'i_am_not_password';
    const localLoginData: LocalLoginDto = { email, password: wrongPassword };
    const { status } = await request.post('/login').send(localLoginData);

    expect([401]).toContain(status);
  });

  test('GET: /logout [302] logout and redirect home', async () => {
    const { status } = await request.get('/logout');

    expect([301, 302]).toContain(status);
  });

  afterAll(async () => {
    await userRepository.query(`DELETE FROM user WHERE email='${email}'`);
    await app?.close();
  });

  afterEach(async () => {});
});
