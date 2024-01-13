import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Express } from 'express';

import { AppModule } from '../../src/app.module';
import { LocalRegisterDto } from '../../src/shared/user/dto';
import { initializeTransactionalContext } from 'typeorm-transactional';
import supertest from 'supertest';
import { Repository } from 'typeorm';
import { User } from '#entities/user.entity';

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

  afterAll(async () => {
    await app?.close();
  });

  afterEach(async () => {
    await userRepository.query(`DELETE FROM user WHERE email='${email}'`);
  });
});
