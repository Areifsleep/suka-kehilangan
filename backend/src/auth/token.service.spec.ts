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
    },
  };

  const mockJwtConfig = {
    secret: 'jwt-secret',
    expiresIn: '15m',
  };

  const mockRefreshJwtConfig = {
    secret: 'refresh-secret',
    expiresIn: '7d',
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
      const jti = 'jti-123';
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      // Mock UUID v7 generation
      jest.spyOn(require('uuid'), 'v7').mockReturnValue(jti);

      mockJwtService.signAsync
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(refreshToken);

      const result = await service.generateTokens(userId);

      expect(result).toEqual({
        accessToken,
        refreshToken,
        jti,
      });

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);

      // Check access token generation (without extra options)
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(1, {
        sub: userId,
        jti,
      });

      // Check refresh token generation
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        { sub: userId, jti },
        {
          secret: mockRefreshJwtConfig.secret,
          expiresIn: mockRefreshJwtConfig.expiresIn,
        },
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
    it.skip('should generate access token', () => {
      const userId = 'user-123';
      const accessToken = 'new-access-token';

      // Create a new mock for this test
      const freshJwtService = {
        sign: jest.fn().mockReturnValue(accessToken),
        signAsync: jest.fn(),
        verifyAsync: jest.fn(),
      };

      // Create new service instance for this test
      const freshTokenService = new TokenService(
        prismaService,
        freshJwtService as any,
        mockRefreshJwtConfig,
      );

      const result = freshTokenService.generateAccessToken(userId);

      expect(result).toBe(accessToken);
      expect(freshJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: userId,
          jti: expect.any(String),
        }),
      );
    });
  });

  describe('generateAccessToken error handling', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.skip('should handle JWT service errors in access token generation', () => {
      const userId = 'user-123';

      mockJwtService.sign.mockImplementation(() => {
        throw new Error('Access token generation failed');
      });

      expect(() => {
        service.generateAccessToken(userId);
      }).toThrow('Access token generation failed');
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
});
