import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshJwtStrategy } from './refresh.strategy';
import { TokenService } from '../token.service';
import { PrismaService } from '../../prisma/prisma.service';
import refreshJwtConfig from '../config/refresh.jwt.config';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('RefreshJwtStrategy', () => {
  let strategy: RefreshJwtStrategy;
  let tokenService: TokenService;
  let prismaService: PrismaService;

  const mockTokenService = {
    isBlacklisted: jest.fn(),
  };

  const mockPrismaService = {
    session: {
      findUnique: jest.fn(),
    },
  };

  const mockRefreshJwtConfig = {
    secret: 'refresh-secret',
    expiresIn: '7d',
  };

  const mockPayload = {
    sub: '1',
    jti: 'jti-123',
  };

  const mockRequest = {
    headers: {
      authorization: 'Bearer refresh-token',
    },
    cookies: {},
  };

  const mockSession = {
    jti: 'jti-123',
    user_id: '1',
    hashed_refresh_token: 'hashed-token',
    expires_at: new Date(Date.now() + 86400000),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshJwtStrategy,
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: refreshJwtConfig.KEY,
          useValue: mockRefreshJwtConfig,
        },
      ],
    }).compile();

    strategy = module.get<RefreshJwtStrategy>(RefreshJwtStrategy);
    tokenService = module.get<TokenService>(TokenService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return user id and jti for valid payload', async () => {
      mockTokenService.isBlacklisted.mockResolvedValue(null);
      mockPrismaService.session.findUnique.mockResolvedValue(mockSession);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      const result = await strategy.validate(mockRequest as any, mockPayload);

      expect(tokenService.isBlacklisted).toHaveBeenCalledWith('jti-123');
      expect(prismaService.session.findUnique).toHaveBeenCalledWith({
        where: { jti: 'jti-123' },
      });
      expect(result).toEqual({
        id: '1',
        jti: 'jti-123',
      });
    });

    it('should throw UnauthorizedException when token is blacklisted', async () => {
      mockTokenService.isBlacklisted.mockResolvedValue({ jti: 'jti-123' });

      await expect(
        strategy.validate(mockRequest as any, mockPayload),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when session not found', async () => {
      mockTokenService.isBlacklisted.mockResolvedValue(null);
      mockPrismaService.session.findUnique.mockResolvedValue(null);

      await expect(
        strategy.validate(mockRequest as any, mockPayload),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when payload is invalid', async () => {
      const invalidPayload = { sub: '1' }; // missing jti

      await expect(
        strategy.validate(mockRequest as any, invalidPayload as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
