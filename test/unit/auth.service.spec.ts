import { User } from '#entities/index';
import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService, Payload, RoleName } from 'src/auth';
import { ConfigService, UtilService } from 'src/common';
import { SNSUserDto } from 'src/shared/user/dto';
import { UsersRepository } from 'src/shared/user/user.repository';

const mockConfigService = {
  get: jest.fn(),
};

const mockUtilService = {
  passwordCompare: jest.fn(),
};

const mockUsersRepository = {
  findOneByEmail: jest.fn(),
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
    const userId = 1;
    const email = 'test@example.com';
    const password = 'test!0password';
    const passwordHash = 'Hash!@';
    const username = 'Test Username';
    const mockDate = new Date();

    const user: User = {
      userId,
      email,
      username,
      passwordHash,
      createdAt: mockDate,
      updatedAt: mockDate,
    };

    it('should be authenticated user', async () => {
      const userWithoutPasswordHash: User = {
        userId,
        email,
        username,
        createdAt: mockDate,
        updatedAt: mockDate,
      };
      jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(utilService, 'passwordCompare').mockResolvedValue(true);

      const result = await authService.validateUser(email, password);
      expect(result).toStrictEqual(userWithoutPasswordHash);
    });

    it('should be unauthenticated user, because user not exist', async () => {
      jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(utilService, 'passwordCompare').mockResolvedValue(true);

      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
    });

    it('should be unauthenticated user, because wrong password', async () => {
      jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(user);
      jest.spyOn(utilService, 'passwordCompare').mockResolvedValue(false);

      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
    });
  });
  describe('validateSNSUser', () => {
    const userId = 1;
    const email = 'test@example.com';
    const vendor = 'naver';
    const username = 'Test Username';
    const socialId = 'socialid123456!@#@#$';
    const mockDate = new Date();

    const user: User = {
      userId,
      email,
      vendor,
      username,
      socialId,
      createdAt: mockDate,
      updatedAt: mockDate,
    };

    const snsUserData: SNSUserDto = {
      username,
      email,
      socialId,
      vendor,
    };

    it('should be authenticated SNS user', async () => {
      jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(user);

      const result = await authService.validateSNSUser(snsUserData);
      expect(result).toStrictEqual(user);
    });

    it('should be unauthenticated SNS user, because user email not exist', async () => {
      jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(null);

      const result = await authService.validateSNSUser(snsUserData);
      expect(result).toBeNull();
    });

    it('should be unauthenticated SNS user, because user exist in other vendor', async () => {
      const snsUserDataOtherVendor: SNSUserDto = {
        username,
        email,
        socialId,
        vendor: 'other vendor',
      };

      jest.spyOn(usersRepository, 'findOneByEmail').mockResolvedValue(user);

      await expect(async () => {
        await authService.validateSNSUser(snsUserDataOtherVendor);
      }).rejects.toThrow(HttpException);
      await expect(async () => {
        await authService.validateSNSUser(snsUserDataOtherVendor);
      }).rejects.toThrow(`Email already exists in ${user.vendor}`);
    });
  });

  describe('jwtSign', () => {
    const role: RoleName = { roleName: 'Test' };
    const payload: Payload = { userId: 1, username: 'Test Username', roles: [role] };

    it('should be generated JWT Tokens', async () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('1d');
      jest.spyOn(configService, 'get').mockReturnValueOnce('MOCK_ACCESS_SECRET');
      jest.spyOn(configService, 'get').mockReturnValueOnce('30d');
      jest.spyOn(configService, 'get').mockReturnValueOnce('MOCK_REFRESH_SECRET');

      const setRefreshTokenSpy = jest
        .spyOn(usersRepository, 'setRefreshToken')
        .mockResolvedValue(true);
      const result = await authService.jwtSign(payload);

      expect(setRefreshTokenSpy).toHaveBeenCalledWith(payload.userId, expect.any(String));
      expect(result.accessToken).toBeTruthy();
      expect(result.refreshToken).toBeTruthy();
    });
  });
});
