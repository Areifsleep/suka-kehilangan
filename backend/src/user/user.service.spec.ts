import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockUser = {
    id: '1',
    username: 'testuser',
    password: 'hashedpassword',
    email: 'test@example.com',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUserWithPermissions = {
    ...mockUser,
    role: {
      id: '1',
      name: 'admin',
      role_permissions: [
        {
          permission: {
            id: '1',
            name: 'read',
            description: 'Read permission',
          },
        },
      ],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(prismaService.user.findMany).toHaveBeenCalledWith();
    });

    it('should return empty array when no users found', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prismaService.user.findMany).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
      });
    });
  });

  describe('findByUsernameWithAllPermissions', () => {
    it('should return user with permissions by username', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(
        mockUserWithPermissions,
      );

      const result = await service.findByUsernameWithAllPermissions('testuser');

      expect(result).toEqual(mockUserWithPermissions);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
        include: {
          role: {
            include: {
              role_permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });
    });

    it('should return null when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByUsernameWithAllPermissions('unknown');

      expect(result).toBeNull();
    });
  });

  describe('findByIdWithAllPermissions', () => {
    it('should return user with permissions and profile by id', async () => {
      const userWithProfile = {
        ...mockUserWithPermissions,
        profile: {
          id: '1',
          user_id: '1',
          full_name: 'Test User',
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(userWithProfile);

      const result = await service.findByIdWithAllPermissions('1');

      expect(result).toEqual(userWithProfile);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          profile: true,
          role: {
            include: {
              role_permissions: {
                select: {
                  permission: {
                    select: {
                      id: true,
                      name: true,
                      description: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });

    it('should return null when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByIdWithAllPermissions('999');

      expect(result).toBeNull();
    });
  });
});
