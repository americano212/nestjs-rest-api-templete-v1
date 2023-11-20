import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { User } from '#entities/user.entity';

import { AuthService } from '../../src/auth';
import { ConfigService, UtilService } from '../../src/common';
import { UsersRepository } from '../../src/shared/user';
import { JwtService } from '@nestjs/jwt';

const mockConfigService = {
  get: jest.fn(),
};

const mockUtilService = {
  passwordCompare: jest.fn(),
};

const mockUsersRepository = {
  getByEmail: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let utilService: UtilService;
  //let configService: ConfigService;
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
    //configService = module.get<ConfigService>(ConfigService);
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
    it('should be successful authentication with the correct email and password.', async () => {
      jest.spyOn(usersRepository, 'getByEmail').mockResolvedValue(user);
      jest.spyOn(utilService, 'passwordCompare').mockResolvedValue(true);
      const result = await authService.validateUser(email, password);
      expect(result).toStrictEqual(userWithoutPasswordHash);
    });
  });
});
