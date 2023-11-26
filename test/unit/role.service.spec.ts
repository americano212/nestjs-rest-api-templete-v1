import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { HttpException } from '@nestjs/common';

import { Role } from '#entities/role.entity';
import { UserRole } from '#entities/user-role.entity';
import { User } from '#entities/user.entity';

import { RoleService, RolesRepository, UserRolesRepository } from '../../src/shared/role/providers';

describe('RoleService', () => {
  let roleService: RoleService;
  let rolesRepository: RolesRepository;
  let userRolesRepository: UserRolesRepository;

  const mockRolesRepository = {
    findRoleByName: jest.fn(),
  };

  const mockUserRolesRepository = {
    create: jest.fn(),
  };

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

  describe('addRoleToUser', () => {
    const role_name = 'User';
    const user: User = {
      user_id: 1,
      username: faker.person.fullName(),
      passwordHash: 'Hash!',
      email: faker.internet.email(),
      created_at: new Date(),
      updated_at: new Date(),
      roles: [],
    };
    const role: Role = {
      role_id: 1,
      role_name,
      users: [new UserRole()],
      created_at: new Date(),
      updated_at: new Date(),
    };
    it('should assign a role to the user', async () => {
      jest.spyOn(rolesRepository, 'findRoleByName').mockResolvedValue(role);
      jest.spyOn(userRolesRepository, 'create').mockResolvedValue(new UserRole());

      const result = await roleService.addRoleToUser(role_name, user);
      expect(result).toBe(true);
    });
    it('should throw an exception for an invalid role', async () => {
      jest.spyOn(rolesRepository, 'findRoleByName').mockResolvedValue(null);
      jest.spyOn(userRolesRepository, 'create').mockResolvedValue(new UserRole());

      await expect(async () => {
        await roleService.addRoleToUser(role_name, user);
      }).rejects.toThrow(HttpException);
      await expect(async () => {
        await roleService.addRoleToUser(role_name, user);
      }).rejects.toThrow(`The role ${role_name} is not valid role`);
    });
  });
});
