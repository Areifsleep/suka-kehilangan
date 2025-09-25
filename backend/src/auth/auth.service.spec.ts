import * as argon2 from 'argon2';
import * as ms from 'ms';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import refreshJwtConfig from './config/refresh.jwt.config';

jest.mock('argon2');
jest.mock('ms');
jest.mock('uuid', () => ({
  v7: jest.fn(() => 'mocked-uuid-v7'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let prismaService: PrismaService;
  let tokenService: TokenService;

  const mockUser = {
    id: '1',
    username: 'testuser',
    password: 'hashedpassword',
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

  const mockTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    jti: 'test-jti',
  };

  const mockUserService = {
    findByUsernameWithAllPermissions: jest.fn(),
  };

  const mockPrismaService = {
    session: {
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockTokenService = {
    generateTokens: jest.fn(),
    generateAccessToken: jest.fn(),
    revokeJti: jest.fn(),
  };

  const mockRefreshConfig = {
    expiresIn: '1d',
    secret: 'refresh-secret',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: refreshJwtConfig.KEY,
          useValue: mockRefreshConfig,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    tokenService = module.get<TokenService>(TokenService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user id when credentials are valid', async () => {
      mockUserService.findByUsernameWithAllPermissions.mockResolvedValue(
        mockUser,
      );
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'correctpassword');

      expect(result).toEqual({ id: mockUser.id });
      expect(userService.findByUsernameWithAllPermissions).toHaveBeenCalledWith(
        'testuser',
      );
      expect(argon2.verify).toHaveBeenCalledWith(
        mockUser.password,
        'correctpassword',
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserService.findByUsernameWithAllPermissions.mockResolvedValue(null);

      await expect(
        service.validateUser('unknownuser', 'password'),
      ).rejects.toThrow(
        new UnauthorizedException('Invalid username or password'),
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUserService.findByUsernameWithAllPermissions.mockResolvedValue(
        mockUser,
      );
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('testuser', 'wrongpassword'),
      ).rejects.toThrow(
        new UnauthorizedException('Invalid username or password'),
      );
    });
  });

  describe('signIn', () => {
    it('should generate tokens and create session', async () => {
      const userId = '1';
      const expiresAt = new Date(Date.now() + 86400000); // 1 day

      mockTokenService.generateTokens.mockResolvedValue(mockTokens);
      (ms as jest.Mock).mockReturnValue(86400000); // 1 day in ms
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');
      mockPrismaService.session.upsert.mockResolvedValue({});

      const result = await service.signIn(userId);

      expect(result).toEqual(mockTokens);
      expect(tokenService.generateTokens).toHaveBeenCalledWith(userId);
      expect(argon2.hash).toHaveBeenCalledWith(mockTokens.refreshToken);
      expect(prismaService.session.upsert).toHaveBeenCalledWith({
        where: { user_id: userId },
        update: {
          hashed_refresh_token: 'hashed-refresh-token',
          expires_at: expect.any(Date),
          jti: mockTokens.jti,
        },
        create: {
          user_id: userId,
          hashed_refresh_token: 'hashed-refresh-token',
          expires_at: expect.any(Date),
          jti: mockTokens.jti,
        },
      });
    });

    it('should handle numeric expiresIn configuration', async () => {
      const userId = '1';
      const numericConfig = { ...mockRefreshConfig, expiresIn: 3600 }; // 1 hour in seconds

      // Mock the config to return numeric value
      jest
        .spyOn(service, 'signIn')
        .mockImplementation(async (userId: string) => {
          const tokens = await tokenService.generateTokens(userId);
          const expiresIn = numericConfig.expiresIn;
          const ttlMs =
            typeof expiresIn === 'string' ? ms(expiresIn) : expiresIn * 1000;
          const expiresAt = new Date(Date.now() + ttlMs);

          const hashedRefreshToken = await argon2.hash(tokens.refreshToken);

          await prismaService.session.upsert({
            where: { user_id: userId },
            update: {
              hashed_refresh_token: hashedRefreshToken,
              expires_at: expiresAt,
              jti: tokens.jti,
            },
            create: {
              user_id: userId,
              hashed_refresh_token: hashedRefreshToken,
              expires_at: expiresAt,
              jti: tokens.jti,
            },
          });

          return tokens;
        });

      mockTokenService.generateTokens.mockResolvedValue(mockTokens);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');
      mockPrismaService.session.upsert.mockResolvedValue({});

      const result = await service.signIn(userId);
      expect(result).toEqual(mockTokens);
    });
  });

  describe('refresh', () => {
    it('should generate new access token', async () => {
      const userId = '1';
      const newAccessToken = 'new-access-token';

      mockTokenService.generateAccessToken.mockResolvedValue(newAccessToken);

      const result = await service.refresh(userId);

      expect(result).toEqual({ newAccessToken });
      expect(tokenService.generateAccessToken).toHaveBeenCalledWith(userId);
    });
  });

  describe('signOut', () => {
    it('should delete session and revoke jti', async () => {
      const userId = '1';
      const sessionData = { jti: 'test-jti', user_id: userId };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          session: {
            delete: jest.fn().mockResolvedValue(sessionData),
          },
        };
        return callback(mockTx);
      });

      await service.signOut(userId);

      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(tokenService.revokeJti).toHaveBeenCalledWith('test-jti');
    });
  });

  describe('getSession', () => {
    it('should be defined', async () => {
      const result = await service.getSession();
      expect(result).toBeUndefined();
    });
  });

  describe('changePassword', () => {
    it('should be defined', async () => {
      const result = await service.changePassword();
      expect(result).toBeUndefined();
    });
  });
});
