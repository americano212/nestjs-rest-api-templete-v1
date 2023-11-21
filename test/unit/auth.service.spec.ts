import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';

import { User } from '#entities/user.entity';

import { AuthService, Payload } from '../../src/auth';
import { ConfigService, UtilService } from '../../src/common';
import { UsersRepository } from '../../src/shared/user';

const mockConfigService = {
  get: jest.fn(),
};

const mockUtilService = {
  passwordCompare: jest.fn(),
};

const mockUsersRepository = {
  getByEmail: jest.fn(),
  setRefreshToken: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let utilService: UtilService;
  let configService: ConfigService;
  let usersRepository: UsersRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UtilService,
          useValue: mockUtilService,
        },
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    utilService = module.get<UtilService>(UtilService);
    configService = module.get<ConfigService>(ConfigService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('validateUser', () => {
    const user_id = 1;
    const username = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    const userWithoutPasswordHash: User = {
      user_id,
      username,
      email,
      created_at: new Date(),
      updated_at: new Date(),
      roles: [],
    };
    const user: User = {
      passwordHash: 'Hash!',
      ...userWithoutPasswordHash,
    };
    it('should be successful authentication with the correct email and password', async () => {
      jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(user);
      jest.spyOn(utilService, 'passwordCompare').mockResolvedValue(true);

      const result = await authService.validateUser(email, password);
      expect(result).toStrictEqual(userWithoutPasswordHash);
    });
    it('should be fail authentication with the wrong email, correct password', async () => {
      const wrong_email = email + '!';
      jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(null);
      jest.spyOn(utilService, 'passwordCompare').mockResolvedValue(true);

      const result = await authService.validateUser(wrong_email, password);
      expect(result).toBeNull();
    });
    it('should be fail authentication with the correct email, wrong password', async () => {
      const wrong_password = password + '!';
      jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(user);
      jest.spyOn(utilService, 'passwordCompare').mockResolvedValue(false);

      const result = await authService.validateUser(email, wrong_password);
      expect(result).toBeNull();
    });
    it('should be fail authentication with the wrong email, wrong password', async () => {
      const wrong_email = email + '!';
      const wrong_password = password + '!';
      jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(null);
      jest.spyOn(utilService, 'passwordCompare').mockResolvedValue(false);

      const result = await authService.validateUser(wrong_email, wrong_password);
      expect(result).toBeNull();
    });
  });
  describe('jwtSign', () => {
    it('should be successfully generate jwt tokens', async () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('1d');
      jest.spyOn(configService, 'get').mockReturnValueOnce('YOUR_ACCESS_SECRET');
      jest.spyOn(configService, 'get').mockReturnValueOnce('30d');
      jest.spyOn(configService, 'get').mockReturnValueOnce('YOUR_REFRESH_SECRET');

      const setRefreshTokenSpy = jest
        .spyOn(usersRepository, 'setRefreshToken')
        .mockResolvedValue(true);

      const payload: Payload = {
        user_id: 1,
        username: faker.person.fullName(),
        roles: ['user', 'admin'],
      };
      const result = await authService.jwtSign(payload);

      expect(setRefreshTokenSpy).toHaveBeenCalledWith(payload.user_id, expect.any(String));
      expect(result.access_token).toBeTruthy();
      expect(result.refresh_token).toBeTruthy();
    });
  });
});
