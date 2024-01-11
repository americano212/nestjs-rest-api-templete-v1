import { User } from '#entities/index';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService, Payload, RoleName } from 'src/auth';
import { ConfigService, UtilService } from 'src/common';
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
      userId: 1,
      email,
      username,
      passwordHash,
      createdAt: mockDate,
      updatedAt: mockDate,
    };
    // TODO authenticated return user data

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
    // TODO 없는 유저
    // TODO 다른 password
  });
  describe('validateSNSUser', () => {
    // TODO sns authenticated return user data
    // TODO 없는 유저
    // TODO 해당 이메일로 다른 vendor에 생성
  });
  describe('jwtSign', () => {
    const role: RoleName = { roleName: 'Test' };
    const payload: Payload = { userId: 1, username: 'Test Username', roles: [role] };
    // TODO generated JWT Token from payload
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
