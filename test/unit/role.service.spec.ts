import { User, UserRole } from '#entities/index';
import { Role } from '#entities/role.entity';
import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MysqlErrorCode } from 'src/common';
import { CreateRoleDto } from 'src/shared/role/dto';
import { RoleService, RolesRepository, UserRolesRepository } from 'src/shared/role/providers';
import { QueryFailedError } from 'typeorm';

const mockRolesRepository = {
  create: jest.fn(),
  findRoleByName: jest.fn(),
};

const mockUserRolesRepository = {
  create: jest.fn(),
};

describe('RoleService', () => {
  let roleService: RoleService;
  let rolesRepository: RolesRepository;
  let userRolesRepository: UserRolesRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RolesRepository,
          useValue: mockRolesRepository,
        },
        {
          provide: UserRolesRepository,
          useValue: mockUserRolesRepository,
        },
      ],
    }).compile();
    roleService = module.get<RoleService>(RoleService);
    rolesRepository = module.get<RolesRepository>(RolesRepository);
    userRolesRepository = module.get<UserRolesRepository>(UserRolesRepository);
  });

  it('should be defined', () => {
    expect(roleService).toBeDefined();
  });

  describe('create', () => {
    const roleName = 'Test';
    const roleData: CreateRoleDto = { roleName };

    it('should be created new role', async () => {
      const newRole: Role = {
        roleId: 1,
        roleName,
      };
      jest.spyOn(rolesRepository, 'create').mockResolvedValue(newRole);

      const result = await roleService.create(roleData);
      expect(result).toStrictEqual(newRole);
    });

    it('should handle role creation failure', async () => {
      const mockQueryFailedError = new QueryFailedError('SELECT', [], {
        name: 'Duplicate entry',
        message: MysqlErrorCode.ALREADY_EXIST,
      } as Error);

      jest.spyOn(rolesRepository, 'create').mockRejectedValue(mockQueryFailedError);

      await expect(async () => {
        await roleService.create(roleData);
      }).rejects.toThrow(QueryFailedError);
    });
  });

  describe('giveRoleToUser', () => {
    const userId = 1;
    const roleName1 = 'Test';
    const roleName2 = 'User';

    const userRole1: UserRole = { userRoleId: 1, roleName: roleName1 };
    const userRole2: UserRole = { userRoleId: 2, roleName: roleName2 };

    const user: User = {
      userId,
      email: 'test@example.com',
      username: 'Test Username',
      roles: [userRole1, userRole2],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should be given role to user', async () => {
      const newRoleName = 'NewRole';
      const role: Role = { roleId: 1, roleName: newRoleName };
      const newUserRole: UserRole = { userRoleId: 3, roleName: newRoleName, user, role };
      jest.spyOn(rolesRepository, 'findRoleByName').mockResolvedValue(role);
      jest.spyOn(userRolesRepository, 'create').mockResolvedValue(newUserRole);

      const result = await roleService.giveRoleToUser(newRoleName, user);
      expect(result).toBe(true);
    });

    it('should handle given role to user failure, because role already exist in user', async () => {
      const oldRoleName = roleName1;
      const role: Role = { roleId: 1, roleName: oldRoleName };
      const newUserRole: UserRole = { userRoleId: 3, roleName: oldRoleName, user, role };
      jest.spyOn(rolesRepository, 'findRoleByName').mockResolvedValue(role);
      jest.spyOn(userRolesRepository, 'create').mockResolvedValue(newUserRole);

      await expect(async () => {
        await roleService.giveRoleToUser(oldRoleName, user);
      }).rejects.toThrow(HttpException);
      await expect(async () => {
        await roleService.giveRoleToUser(oldRoleName, user);
      }).rejects.toThrow(`'${oldRoleName}' already exist role to user '${user.userId}'`);
    });
  });
});
