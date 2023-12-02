import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';

import { User } from '#entities/user.entity';

import { AuthService, Payload } from '../../src/auth';
import { ConfigService, UtilService } from '../../src/common';
import { SNSUser, UsersRepository } from '../../src/shared/user';
import { HttpException } from '@nestjs/common';

const mockConfigService = {
  get: jest.fn(),
};

const mockUtilService = {
  passwordCompare: jest.fn(),
};

const mockUsersRepository = {
  getByEmail: jest.fn(),
  setRefreshToken: jest.fn(),
  create: jest.fn(),
};

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

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
      jest.spyOn(configService, 'get').mockReturnValueOnce('MOCK_ACCESS_SECRET');
      jest.spyOn(configService, 'get').mockReturnValueOnce('30d');
      jest.spyOn(configService, 'get').mockReturnValueOnce('MOCK_REFRESH_SECRET');

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
  describe('validateSNSUser', () => {
    const socialUser: SNSUser = {
      username: faker.person.fullName(),
      email: faker.internet.email(),
      social_id: '123456789',
      vendor: 'test-vendor',
    };

    it('should be login when already social user exist', async () => {
      const user: User = {
        ...socialUser,
        user_id: 1,
        roles: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(user);

      const result = await authService.validateSNSUser(socialUser);
      expect(result).toStrictEqual(user);
    });

    it('should be throw error when already email exist but vendor or social_id unmatch', async () => {
      const user: User = {
        ...socialUser,
        user_id: 1,
        roles: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
      user.vendor = 'error-vendor';
      user.social_id = '987654321';
      jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(user);

      await expect(async () => {
        await authService.validateSNSUser(socialUser);
      }).rejects.toThrow(HttpException);
      await expect(async () => {
        await authService.validateSNSUser(socialUser);
      }).rejects.toThrow(`User's Email already exists in ${user.vendor}`);
    });
  });
});
