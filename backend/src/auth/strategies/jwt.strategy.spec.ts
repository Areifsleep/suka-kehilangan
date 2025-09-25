import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../../user/user.service';
import { TokenService } from '../token.service';
import jwtConfig from '../config/jwt.config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userService: UserService;
  let tokenService: TokenService;

  const mockUserService = {
    findByIdWithAllPermissions: jest.fn(),
  };

  const mockTokenService = {
    isBlacklisted: jest.fn(),
  };

  const mockJwtConfig = {
    secret: 'jwt-secret',
    expiresIn: '15m',
  };

  const mockUser = {
    id: '1',
    username: 'testuser',
    profile: {
      full_name: 'Test User',
      email: 'test@example.com',
    },
    role: {
      name: 'admin',
      role_permissions: [
        {
          permission: {
            name: 'read',
          },
        },
        {
          permission: {
            name: 'write',
          },
        },
      ],
    },
  };

  const mockPayload = {
    sub: '1',
    jti: 'jti-123',
    iat: 1234567890,
    exp: 1234567890,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: jwtConfig.KEY,
          useValue: mockJwtConfig,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
    tokenService = module.get<TokenService>(TokenService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate user successfully', async () => {
      mockTokenService.isBlacklisted.mockResolvedValue(null);
      mockUserService.findByIdWithAllPermissions.mockResolvedValue(mockUser);

      const result = await strategy.validate(mockPayload);

      expect(tokenService.isBlacklisted).toHaveBeenCalledWith('jti-123');
      expect(userService.findByIdWithAllPermissions).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        id: '1',
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
        permissions: ['read', 'write'],
      });
    });

    it('should throw UnauthorizedException when token is blacklisted', async () => {
      mockTokenService.isBlacklisted.mockResolvedValue({ jti: 'jti-123' });

      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(tokenService.isBlacklisted).toHaveBeenCalledWith('jti-123');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockTokenService.isBlacklisted.mockResolvedValue(null);
      mockUserService.findByIdWithAllPermissions.mockResolvedValue(null);

      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle user without profile', async () => {
      const userWithoutProfile = {
        ...mockUser,
        profile: null,
      };

      mockTokenService.isBlacklisted.mockResolvedValue(null);
      mockUserService.findByIdWithAllPermissions.mockResolvedValue(
        userWithoutProfile,
      );

      const result = await strategy.validate(mockPayload);

      expect(result).toEqual({
        id: '1',
        full_name: undefined, // Should be undefined when no profile
        username: 'testuser',
        email: undefined, // Should be undefined when no profile
        role: 'admin',
        permissions: ['read', 'write'],
      });
    });

    it('should handle user without role permissions', async () => {
      const userWithoutPermissions = {
        ...mockUser,
        role: {
          name: 'user',
          role_permissions: [],
        },
      };

      mockTokenService.isBlacklisted.mockResolvedValue(null);
      mockUserService.findByIdWithAllPermissions.mockResolvedValue(
        userWithoutPermissions,
      );

      const result = await strategy.validate(mockPayload);

      expect(result).toEqual({
        id: '1',
        full_name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        permissions: [],
      });
    });

    it('should handle database errors gracefully', async () => {
      mockTokenService.isBlacklisted.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
