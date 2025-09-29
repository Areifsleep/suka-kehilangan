import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { PrismaService } from '../prisma/prisma.service';
import jwtConfig from './config/jwt.config';
import refreshJwtConfig from './config/refresh.jwt.config';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let prismaService: PrismaService;

  const mockJwtService = {
    signAsync: jest.fn(),
    sign: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockPrismaService = {
    revokedJwt: {
      findUnique: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
    },
  };

  const mockJwtConfig = {
    secret: 'jwt-secret',
    expiresIn: '15m',
  };

  const mockRefreshJwtConfig = {
    secret: 'refresh-secret',
    expiresIn: '1d',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: jwtConfig.KEY,
          useValue: mockJwtConfig,
        },
        {
          provide: refreshJwtConfig.KEY,
          useValue: mockRefreshJwtConfig,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokens', () => {
    it('should generate both access and refresh tokens', async () => {
      const userId = 'user-123';
      const baseUuid = 'jti-123';
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      // Mock UUID v7 generation
      jest.spyOn(require('uuid'), 'v7').mockReturnValue(baseUuid);

      mockJwtService.signAsync
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(refreshToken);

      const result = await service.generateTokens(userId);

      expect(result).toEqual({
        accessToken,
        refreshToken,
        accessJti: `acc_${baseUuid}`,
        refreshJti: `ref_${baseUuid}`,
      });

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);

      // Check access token generation
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(1, {
        sub: userId,
        jti: `acc_${baseUuid}`,
      });

      // Check refresh token generation
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        { sub: userId, jti: `ref_${baseUuid}` },
        mockRefreshJwtConfig,
      );
    });

    it('should handle JWT service errors', async () => {
      const userId = 'user-123';
      mockJwtService.signAsync.mockRejectedValue(
        new Error('JWT generation failed'),
      );

      await expect(service.generateTokens(userId)).rejects.toThrow(
        'JWT generation failed',
      );
    });
  });

  describe('generateAccessToken', () => {
    it('should generate access token', async () => {
      const userId = 'user-123';
      const baseUuid = 'uuid-123';
      const accessToken = 'new-access-token';

      jest.spyOn(require('uuid'), 'v7').mockReturnValue(baseUuid);
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service.generateAccessToken(userId);

      expect(result).toBe(accessToken);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: userId,
        jti: `acc_${baseUuid}`,
      });
    });
  });

  describe('generateAccessToken error handling', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle JWT service errors in access token generation', async () => {
      const userId = 'user-123';

      mockJwtService.sign.mockImplementation(() => {
        throw new Error('Access token generation failed');
      });

      await expect(service.generateAccessToken(userId)).rejects.toThrow(
        'Access token generation failed',
      );
    });
  });

  describe('isBlacklisted', () => {
    it('should check if JTI is blacklisted', async () => {
      const jti = 'jti-123';
      const mockPrismaService = {
        revokedJwt: {
          findUnique: jest
            .fn()
            .mockResolvedValue({ jti, expires_at: new Date() }),
        },
      };

      // Mock PrismaService for this test
      Object.defineProperty(service, 'prismaService', {
        value: mockPrismaService,
        writable: true,
      });

      const result = await service.isBlacklisted(jti);

      expect(result).toEqual({ jti, expires_at: expect.any(Date) });
      expect(mockPrismaService.revokedJwt.findUnique).toHaveBeenCalledWith({
        where: { jti },
      });
    });

    it('should return null for non-blacklisted JTI', async () => {
      const jti = 'jti-123';
      const mockPrismaService = {
        revokedJwt: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      };

      Object.defineProperty(service, 'prismaService', {
        value: mockPrismaService,
        writable: true,
      });

      const result = await service.isBlacklisted(jti);

      expect(result).toBeNull();
    });
  });

  describe('revokeJti', () => {
    it('should revoke JTI by storing it in database', async () => {
      const jti = 'jti-to-revoke';
      const mockPrismaService = {
        revokedJwt: {
          create: jest
            .fn()
            .mockResolvedValue({ jti, expires_at: expect.any(Date) }),
        },
      };

      Object.defineProperty(service, 'prismaService', {
        value: mockPrismaService,
        writable: true,
      });

      await service.revokeJti(jti);

      expect(mockPrismaService.revokedJwt.create).toHaveBeenCalledWith({
        data: {
          jti,
          expires_at: expect.any(Date),
        },
      });
    });

    it('should handle database errors when revoking JTI', async () => {
      const jti = 'jti-to-revoke';
      const mockPrismaService = {
        revokedJwt: {
          create: jest.fn().mockRejectedValue(new Error('Database error')),
        },
      };

      Object.defineProperty(service, 'prismaService', {
        value: mockPrismaService,
        writable: true,
      });

      await expect(service.revokeJti(jti)).rejects.toThrow('Database error');
    });
  });

  describe('revokeMultipleJtis', () => {
    it('should revoke multiple JTIs', async () => {
      const jtis = ['jti-1', 'jti-2', 'jti-3'];
      const mockPrismaService = {
        revokedJwt: {
          createMany: jest.fn().mockResolvedValue({ count: 3 }),
        },
      };

      Object.defineProperty(service, 'prismaService', {
        value: mockPrismaService,
        writable: true,
      });

      await service.revokeMultipleJtis(jtis);

      expect(mockPrismaService.revokedJwt.createMany).toHaveBeenCalledWith({
        data: jtis.map((jti) => ({
          jti,
          expires_at: expect.any(Date),
        })),
        skipDuplicates: true,
      });
    });

    it('should handle empty JTI array', async () => {
      const mockPrismaService = {
        revokedJwt: {
          createMany: jest.fn(),
        },
      };

      Object.defineProperty(service, 'prismaService', {
        value: mockPrismaService,
        writable: true,
      });

      await service.revokeMultipleJtis([]);

      expect(mockPrismaService.revokedJwt.createMany).not.toHaveBeenCalled();
    });
  });

  describe('revokeTokenPair', () => {
    it('should revoke both access and refresh tokens', async () => {
      const accessJti = 'acc_123';
      const refreshJti = 'ref_123';
      const mockPrismaService = {
        revokedJwt: {
          createMany: jest.fn().mockResolvedValue({ count: 2 }),
        },
      };

      Object.defineProperty(service, 'prismaService', {
        value: mockPrismaService,
        writable: true,
      });

      await service.revokeTokenPair(accessJti, refreshJti);

      expect(mockPrismaService.revokedJwt.createMany).toHaveBeenCalledWith({
        data: [
          { jti: accessJti, expires_at: expect.any(Date) },
          { jti: refreshJti, expires_at: expect.any(Date) },
        ],
      });
    });
  });

  describe('revokeAccessTokenForLogout', () => {
    it('should revoke access token during logout', async () => {
      const accessJti = 'acc_logout_123';
      const mockPrismaService = {
        revokedJwt: {
          create: jest
            .fn()
            .mockResolvedValue({
              jti: accessJti,
              expires_at: expect.any(Date),
            }),
        },
      };

      Object.defineProperty(service, 'prismaService', {
        value: mockPrismaService,
        writable: true,
      });

      await service.revokeAccessTokenForLogout(accessJti);

      expect(mockPrismaService.revokedJwt.create).toHaveBeenCalledWith({
        data: {
          jti: accessJti,
          expires_at: expect.any(Date),
        },
      });
    });
  });

  describe('decode', () => {
    it('should decode refresh token', async () => {
      const token = 'refresh-token';
      const decodedPayload = { jti: 'ref_123', sub: 'user-123' };

      mockJwtService.verifyAsync.mockResolvedValue(decodedPayload);

      const result = await service.decode(token);

      expect(result).toEqual(decodedPayload);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, {
        ignoreExpiration: false,
        secret: mockRefreshJwtConfig.secret,
      });
    });

    it('should handle decode errors', async () => {
      const token = 'invalid-token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.decode(token)).rejects.toThrow('Invalid token');
    });
  });

  describe('decodeAccessToken', () => {
    it('should decode access token', async () => {
      const token = 'access-token';
      const decodedPayload = { jti: 'acc_123', sub: 'user-123' };

      mockJwtService.verifyAsync.mockResolvedValue(decodedPayload);

      const result = await service.decodeAccessToken(token);

      expect(result).toEqual(decodedPayload);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, {
        ignoreExpiration: false,
      });
    });

    it('should handle decode errors', async () => {
      const token = 'invalid-access-token';
      mockJwtService.verifyAsync.mockRejectedValue(
        new Error('Invalid access token'),
      );

      await expect(service.decodeAccessToken(token)).rejects.toThrow(
        'Invalid access token',
      );
    });
  });

  describe('isAccessTokenJti', () => {
    it('should return true for access token JTI', () => {
      expect(service.isAccessTokenJti('acc_123')).toBe(true);
    });

    it('should return false for non-access token JTI', () => {
      expect(service.isAccessTokenJti('ref_123')).toBe(false);
      expect(service.isAccessTokenJti('xyz_123')).toBe(false);
    });
  });

  describe('isRefreshTokenJti', () => {
    it('should return true for refresh token JTI', () => {
      expect(service.isRefreshTokenJti('ref_123')).toBe(true);
    });

    it('should return false for non-refresh token JTI', () => {
      expect(service.isRefreshTokenJti('acc_123')).toBe(false);
      expect(service.isRefreshTokenJti('xyz_123')).toBe(false);
    });
  });
});
