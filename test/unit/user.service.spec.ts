import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';

import { User } from '#entities/user.entity';

import { UserService, UsersRepository } from '../../src/shared/user';
import { LocalRegisterDto } from '../../src/shared/user/dto';
import { RoleService } from '../../src/shared/role/providers';
import { UtilService } from '../../src/common';

const mockRepository = {
  create: jest.fn(),
  getByUserId: jest.fn(),
  getByEmail: jest.fn(),
  isExistUsername: jest.fn(),
  isExistEmail: jest.fn(),
  setRefreshToken: jest.fn(),
};

const mockUtilService = {
  passwordEncoding: jest.fn(),
  passwordCompare: jest.fn(),
};

const mockRoleService = {
  addRoleToUser: jest.fn(),
};

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('UserService', () => {
  let userService: UserService;
  let roleService: RoleService;
  let utilService: UtilService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UsersRepository,
          useValue: mockRepository,
        },
        {
          provide: UtilService,
          useValue: mockUtilService,
        },
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    roleService = module.get<RoleService>(RoleService);
    utilService = module.get<UtilService>(UtilService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user.', async () => {
      const username = faker.person.fullName();
      const password = faker.internet.password();
      const email = faker.internet.email();
      const roles = ['User', 'TestRole'];
      const passwordHash = 'Hash!';
      const localRegisterDto: LocalRegisterDto = {
        username,
        password,
        email,
        roles,
      };

      const savedUser: User = {
        user_id: 1,
        username: username,
        passwordHash: passwordHash,
        email: email,
        created_at: new Date(),
        updated_at: new Date(),
        roles: roles,
      };
      jest
        .spyOn(utilService, 'passwordEncoding')
        .mockResolvedValue(passwordHash);
      jest.spyOn(roleService, 'addRoleToUser').mockResolvedValue(true);
      jest.spyOn(usersRepository, 'create').mockResolvedValue(savedUser);

      const result = await userService.create(localRegisterDto);

      expect(result).toBe(true);
    });
  });
});
