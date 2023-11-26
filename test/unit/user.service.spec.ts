import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { HttpException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

import { User } from '#entities/user.entity';

import { MysqlErrorCode, UserService, UsersRepository } from '../../src/shared/user';
import { AddRoleDto, LocalRegisterDto } from '../../src/shared/user/dto';
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
    const username = faker.person.fullName();
    const password = faker.internet.password();
    const email = faker.internet.email();
    const roles = ['User', 'TestRole'];
    const passwordHash = 'Hash!';
    it('should create a user and assign roles', async () => {
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
      jest.spyOn(utilService, 'passwordEncoding').mockResolvedValue(passwordHash);
      jest.spyOn(usersRepository, 'create').mockResolvedValue(savedUser);
      jest.spyOn(roleService, 'addRoleToUser').mockResolvedValue(true);

      const result = await userService.create(localRegisterDto);

      expect(result).toBe(true);
    });
    it('should create a user and empty role', async () => {
      const localRegisterDto: LocalRegisterDto = {
        username,
        password,
        email,
        roles: [],
      };
      const savedUser: User = {
        user_id: 1,
        username: username,
        passwordHash: passwordHash,
        email: email,
        created_at: new Date(),
        updated_at: new Date(),
        roles: [],
      };
      jest.spyOn(utilService, 'passwordEncoding').mockResolvedValue(passwordHash);
      jest.spyOn(usersRepository, 'create').mockResolvedValue(savedUser);
      jest.spyOn(roleService, 'addRoleToUser').mockResolvedValue(false);

      const result = await userService.create(localRegisterDto);

      expect(result).toBe(true);
    });
    it('should throw an exception when attempting to create a user with an existing email', async () => {
      const existingEmail = email;
      const localRegisterDto: LocalRegisterDto = {
        username,
        password,
        email: existingEmail,
        roles,
      };
      const mockQueryFailedError = new QueryFailedError('SELECT', [], new Error('Duplicate entry'));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mockQueryFailedError.driverError = {
        code: MysqlErrorCode.ALREADY_USER,
      } as unknown as Error;
      jest.spyOn(utilService, 'passwordEncoding').mockResolvedValue(passwordHash);
      jest.spyOn(usersRepository, 'create').mockRejectedValue(mockQueryFailedError);
      jest.spyOn(roleService, 'addRoleToUser').mockResolvedValue(true);

      await expect(async () => {
        await userService.create(localRegisterDto);
      }).rejects.toThrow(HttpException);
      await expect(async () => {
        await userService.create(localRegisterDto);
      }).rejects.toThrow("User's Email already exists");
    });
    it('should throw an exception for an invalid role', async () => {
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
      jest.spyOn(utilService, 'passwordEncoding').mockResolvedValue(passwordHash);
      jest.spyOn(usersRepository, 'create').mockResolvedValue(savedUser);
      jest.spyOn(roleService, 'addRoleToUser').mockResolvedValue(false);

      await expect(async () => {
        await userService.create(localRegisterDto);
      }).rejects.toThrow(`The role ${roles[0]} is not valid role`);
    });
  });

  describe('addRole', () => {
    const user_id = 1;
    const username = faker.person.fullName();
    const email = faker.internet.email();
    const passwordHash = 'Hash!';
    const role_name = 'TestRole';
    const user: User = {
      user_id,
      username,
      passwordHash,
      email,
      created_at: new Date(),
      updated_at: new Date(),
      roles: [],
    };
    it('successfully assign a role to a user', async () => {
      const addRoleDto: AddRoleDto = {
        user_id,
        role_name,
      };
      jest.spyOn(usersRepository, 'getByUserId').mockResolvedValue(user);
      jest.spyOn(roleService, 'addRoleToUser').mockResolvedValue(true);

      const result = await userService.addRole(addRoleDto);
      expect(result).toBe(true);
    });
    it('should throw an exception when user_id does NOT Exist', async () => {
      const user_id_not_exist = -1;
      const addRoleDto: AddRoleDto = {
        user_id: user_id_not_exist,
        role_name,
      };
      jest.spyOn(usersRepository, 'getByUserId').mockResolvedValue(null);
      jest.spyOn(roleService, 'addRoleToUser').mockResolvedValue(false);

      await expect(async () => {
        await userService.addRole(addRoleDto);
      }).rejects.toThrow(HttpException);
      await expect(async () => {
        await userService.addRole(addRoleDto);
      }).rejects.toThrow(`User ID ${user_id_not_exist} does NOT Exist`);
    });
    it('should throw an exception for an invalid role', async () => {
      const role_name_not_exist = 'RRole';
      const addRoleDto: AddRoleDto = {
        user_id,
        role_name: role_name_not_exist,
      };
      jest.spyOn(usersRepository, 'getByUserId').mockResolvedValue(user);
      jest.spyOn(roleService, 'addRoleToUser').mockResolvedValue(false);

      await expect(async () => {
        await userService.addRole(addRoleDto);
      }).rejects.toThrow(HttpException);
      await expect(async () => {
        await userService.addRole(addRoleDto);
      }).rejects.toThrow(`The role ${role_name_not_exist} is not valid role`);
    });
  });
});
