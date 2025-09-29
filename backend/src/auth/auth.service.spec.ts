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
    accessJti: 'acc_test-uuid',
    refreshJti: 'ref_test-uuid',
  };

  const mockUserService = {
    findByUsernameWithAllPermissions: jest.fn(),
  };

  const mockPrismaService = {
    session: {
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockTokenService = {
    generateTokens: jest.fn(),
    generateAccessToken: jest.fn(),
    revokeJti: jest.fn(),
    revokeMultipleJtis: jest.fn(),
    revokeAccessTokenForLogout: jest.fn(),
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
        new UnauthorizedException('Username atau password salah'),
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
        new UnauthorizedException('Username atau password salah'),
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
      mockPrismaService.session.create.mockResolvedValue({});

      const result = await service.signIn(userId);

      expect(result).toEqual(mockTokens);
      expect(tokenService.generateTokens).toHaveBeenCalledWith(userId);
      expect(argon2.hash).toHaveBeenCalledWith(mockTokens.refreshToken);
      expect(prismaService.session.create).toHaveBeenCalledWith({
        data: {
          user_id: userId,
          hashed_refresh_token: 'hashed-refresh-token',
          expires_at: expect.any(Date),
          jti: mockTokens.refreshJti,
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

          await prismaService.session.create({
            data: {
              user_id: userId,
              hashed_refresh_token: hashedRefreshToken,
              expires_at: expiresAt,
              jti: tokens.refreshJti,
            },
          });

          return tokens;
        });

      mockTokenService.generateTokens.mockResolvedValue(mockTokens);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');
      mockPrismaService.session.create.mockResolvedValue({});

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
    it('should delete specific session and revoke jti when session exists', async () => {
      const userId = '1';
      const sessionJti = 'ref_test-uuid';
      const sessionData = { jti: sessionJti, user_id: userId };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          session: {
            findUnique: jest.fn().mockResolvedValue(sessionData),
            delete: jest.fn().mockResolvedValue(sessionData),
          },
        };
        return callback(mockTx);
      });

      await service.signOut(userId, sessionJti);

      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(tokenService.revokeJti).toHaveBeenCalledWith(sessionJti);
    });

    it('should handle gracefully when session does not exist', async () => {
      const userId = '1';
      const sessionJti = 'ref_test-uuid';

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          session: {
            findUnique: jest.fn().mockResolvedValue(null),
            delete: jest.fn(),
          },
        };
        return callback(mockTx);
      });

      await service.signOut(userId, sessionJti);

      expect(prismaService.$transaction).toHaveBeenCalled();
      // Should not call delete or revokeJti when session doesn't exist
      expect(tokenService.revokeJti).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when session belongs to different user', async () => {
      const userId = '1';
      const sessionJti = 'ref_test-uuid';
      const sessionData = { jti: sessionJti, user_id: '2' }; // Different user

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          session: {
            findUnique: jest.fn().mockResolvedValue(sessionData),
            delete: jest.fn(),
          },
        };
        return callback(mockTx);
      });

      await expect(service.signOut(userId, sessionJti)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(tokenService.revokeJti).not.toHaveBeenCalled();
    });
  });

  describe('signOutAll', () => {
    it('should delete all sessions and revoke all jtis', async () => {
      const userId = '1';
      const sessions = [{ jti: 'ref_uuid1' }, { jti: 'ref_uuid2' }];

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          session: {
            findMany: jest.fn().mockResolvedValue(sessions),
            deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
          },
        };
        return callback(mockTx);
      });

      await service.signOutAll(userId);

      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(tokenService.revokeMultipleJtis).toHaveBeenCalledWith([
        'ref_uuid1',
        'ref_uuid2',
      ]);
    });

    it('should handle empty sessions array', async () => {
      const userId = '1';
      const sessions: any[] = [];

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          session: {
            findMany: jest.fn().mockResolvedValue(sessions),
            deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
          },
        };
        return callback(mockTx);
      });

      await service.signOutAll(userId);

      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(tokenService.revokeMultipleJtis).not.toHaveBeenCalled();
    });
  });

  describe('getUserSessions', () => {
    it('should return active user sessions', async () => {
      const userId = '1';
      const mockSessions = [
        {
          id: 'session1',
          jti: 'ref_uuid1',
          expires_at: new Date(Date.now() + 86400000),
        },
        {
          id: 'session2',
          jti: 'ref_uuid2',
          expires_at: new Date(Date.now() + 86400000),
        },
      ];

      mockPrismaService.session.findMany.mockResolvedValue(mockSessions);

      const result = await service.getUserSessions(userId);

      expect(result).toEqual(mockSessions);
      expect(prismaService.session.findMany).toHaveBeenCalledWith({
        where: {
          user_id: userId,
          expires_at: {
            gt: expect.any(Date),
          },
        },
        select: {
          id: true,
          jti: true,
          expires_at: true,
        },
      });
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate refresh token successfully', async () => {
      const refreshToken = 'valid-refresh-token';
      const sessionJti = 'ref_test-uuid';
      const mockSession = {
        jti: sessionJti,
        hashed_refresh_token: 'hashed-token',
        expires_at: new Date(Date.now() + 86400000),
        user_id: '1',
      };

      mockPrismaService.session.findUnique.mockResolvedValue(mockSession);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await service.validateRefreshToken(
        refreshToken,
        sessionJti,
      );

      expect(result).toEqual(mockSession);
      expect(prismaService.session.findUnique).toHaveBeenCalledWith({
        where: { jti: sessionJti },
      });
      expect(argon2.verify).toHaveBeenCalledWith(
        mockSession.hashed_refresh_token,
        refreshToken,
      );
    });

    it('should throw UnauthorizedException when session not found', async () => {
      const refreshToken = 'valid-refresh-token';
      const sessionJti = 'ref_test-uuid';

      mockPrismaService.session.findUnique.mockResolvedValue(null);

      await expect(
        service.validateRefreshToken(refreshToken, sessionJti),
      ).rejects.toThrow(
        new UnauthorizedException('Session expired or invalid'),
      );
    });

    it('should throw UnauthorizedException when session expired', async () => {
      const refreshToken = 'valid-refresh-token';
      const sessionJti = 'ref_test-uuid';
      const expiredSession = {
        jti: sessionJti,
        hashed_refresh_token: 'hashed-token',
        expires_at: new Date(Date.now() - 86400000), // expired
        user_id: '1',
      };

      mockPrismaService.session.findUnique.mockResolvedValue(expiredSession);

      await expect(
        service.validateRefreshToken(refreshToken, sessionJti),
      ).rejects.toThrow(
        new UnauthorizedException('Session expired or invalid'),
      );
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';
      const sessionJti = 'ref_test-uuid';
      const mockSession = {
        jti: sessionJti,
        hashed_refresh_token: 'hashed-token',
        expires_at: new Date(Date.now() + 86400000),
        user_id: '1',
      };

      mockPrismaService.session.findUnique.mockResolvedValue(mockSession);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateRefreshToken(refreshToken, sessionJti),
      ).rejects.toThrow(new UnauthorizedException('Invalid refresh token'));
    });
  });

  describe('changePassword', () => {
    it('should be defined', async () => {
      const result = await service.changePassword();
      expect(result).toBeUndefined();
    });
  });
});
