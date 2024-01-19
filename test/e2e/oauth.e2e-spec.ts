import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import supertest from 'supertest';
import type { Express } from 'express';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from 'src/app.module';
import { middleware } from 'src/app.middleware';
import { ValidationException } from 'src/common/exceptions';

describe('oauth', () => {
  let app: INestApplication<Express> | undefined;
  let request: supertest.SuperTest<supertest.Test>;

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
  });

  test('GET: /login/google [302] Redirect google oauth login page', async () => {
    const { status, headers } = await request.get('/login/google');
    expect([302]).toContain(status);
    expect(headers.location).toContain('https://accounts.google.com/o/oauth2/v2/auth');
  });

  test('GET: /login/github [302] Redirect github oauth login page', async () => {
    const { status, headers } = await request.get('/login/github');
    expect([302]).toContain(status);
    expect(headers.location).toContain('https://github.com/login/oauth/authorize');
  });

  test('GET: /login/kakao [302] Redirect kakao oauth login page', async () => {
    const { status, headers } = await request.get('/login/kakao');
    expect([302]).toContain(status);
    expect(headers.location).toContain('https://kauth.kakao.com/oauth/authorize');
  });

  test('GET: /login/naver [302] Redirect naver oauth login page', async () => {
    const { status, headers } = await request.get('/login/naver');
    expect([302]).toContain(status);
    expect(headers.location).toContain('https://nid.naver.com/oauth2.0/authorize');
  });

  afterAll(async () => {
    await app?.close();
  });
});
