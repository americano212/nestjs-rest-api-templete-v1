import { User } from '#entities/index';
import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { QueryFailedError } from 'typeorm';

import { MysqlErrorCode, Role, UtilService } from 'src/common';
import { RoleService } from 'src/shared/role/providers';
import { UserService } from 'src/shared/user/user.service';
import { UsersRepository } from 'src/shared/user/user.repository';
import { GiveRoleToUserDto, LocalRegisterDto, SNSUserDto } from 'src/shared/user/dto';

const mockRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
  findOneByEmail: jest.fn(),
  isExistUsername: jest.fn(),
  isExistEmail: jest.fn(),
  setRefreshToken: jest.fn(),
};

const mockUtilService = {
  passwordEncoding: jest.fn(),
  passwordCompare: jest.fn(),
};

const mockRoleService = {
  giveRoleToUser: jest.fn(),
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

  describe('createLocalUser', () => {
    const email = 'test@example.com';
    const username = 'Test UserName';
    const password = 'test!@#123';
    const passwordHash = 'Hash Password !';
    const userData: LocalRegisterDto = { email, username, password };
    const savedUser: User = {
      userId: 1,
      username,
      passwordHash,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should be created new user', async () => {
      jest.spyOn(utilService, 'passwordEncoding').mockResolvedValue(passwordHash);
      jest.spyOn(usersRepository, 'create').mockResolvedValue(savedUser);

      const result = await userService.createLocalUser(userData);
      expect(result).toBe(savedUser);
    });

    it('should handle user creation failure, because email already exist', async () => {
      const mockQueryFailedError = new QueryFailedError('SELECT', [], {
        name: 'Duplicate entry',
        message: MysqlErrorCode.ALREADY_EXIST,
      } as Error);

      jest.spyOn(utilService, 'passwordEncoding').mockResolvedValue(passwordHash);
      jest.spyOn(usersRepository, 'create').mockRejectedValue(mockQueryFailedError);

      await expect(async () => {
        await userService.createLocalUser(userData);
      }).rejects.toThrow(QueryFailedError);
    });
  });

  describe('createSNSUser', () => {
    const email = 'test@example.com';
    const username = 'Test UserName';
    const socialId = 'TEST!@#$1234TTTEEESSSTTT';
    const vendor = 'kakao';
    const snsUserData: SNSUserDto = { username, email, socialId, vendor };
    const savedUser: User = {
      userId: 1,
      username,
      email,
      socialId,
      vendor,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should be create new sns user', async () => {
      jest.spyOn(usersRepository, 'create').mockResolvedValue(savedUser);

      const result = await userService.createSNSUser(snsUserData);
      expect(result).toBe(savedUser);
    });

    it('should handle user creation failure, because email already exist', async () => {
      const mockQueryFailedError = new QueryFailedError('SELECT', [], {
        name: 'Duplicate entry',
        message: MysqlErrorCode.ALREADY_EXIST,
      } as Error);

      jest.spyOn(usersRepository, 'create').mockRejectedValue(mockQueryFailedError);

      await expect(async () => {
        await userService.createSNSUser(snsUserData);
      }).rejects.toThrow(QueryFailedError);
    });
  });

  describe('giveRole', () => {
    const email = 'test@example.com';
    const username = 'Test UserName';
    const user: User = {
      userId: 1,
      username,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should be given role to user', async () => {
      const giveRoleData: GiveRoleToUserDto = {
        userId: 1,
        roleName: Role.Test,
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(roleService, 'giveRoleToUser').mockResolvedValue(true);

      const result = await userService.giveRole(giveRoleData);
      expect(result).toBe(true);
    });

    it('should handle user not found', async () => {
      const giveRoleData: GiveRoleToUserDto = {
        userId: -1,
        roleName: Role.Test,
      };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(async () => {
        await userService.giveRole(giveRoleData);
      }).rejects.toThrow(HttpException);
      await expect(async () => {
        await userService.giveRole(giveRoleData);
      }).rejects.toThrow(`User ID ${giveRoleData.userId} NOT Found`);
    });
    // TODO 해당 되는 role 없음
    it('should handle invalid role', async () => {
      const giveRoleData: GiveRoleToUserDto = {
        userId: 1,
        roleName: 'invalidrole',
      };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(roleService, 'giveRoleToUser').mockResolvedValue(false);

      await expect(async () => {
        await userService.giveRole(giveRoleData);
      }).rejects.toThrow(HttpException);
      await expect(async () => {
        await userService.giveRole(giveRoleData);
      }).rejects.toThrow(`The role '${giveRoleData.roleName}' invalid role`);
    });
  });
});
