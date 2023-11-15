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

describe('UserService', () => {
  let userService: UserService;
  let roleService: RoleService;
  let repository: UsersRepository;

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
    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('정상적으로 유저가 create되었을 때 true를 반환한다.', async () => {
      const username = faker.person.fullName();
      const password = faker.internet.password();
      const email = faker.internet.email();
      const roles = ['User', 'TestRole'];
      const localRegisterDto: LocalRegisterDto = {
        username,
        password,
        email,
        roles,
      };

      const savedUser: User = {
        user_id: 1,
        username: username,
        passwordHash: 'test-password-hash',
        email: email,
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(roleService, 'addRoleToUser').mockResolvedValue(true);
      jest.spyOn(repository, 'create').mockResolvedValue(savedUser);

      const result = await userService.create(localRegisterDto);

      expect(result).toBe(true);
    });
  });
});
