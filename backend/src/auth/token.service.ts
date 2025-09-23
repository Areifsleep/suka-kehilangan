import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { v7 as uuidv7 } from 'uuid';
import { JwtAuthPayload } from './types/jwt-claims';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh.jwt.config';
import { type ConfigType } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async isBlacklisted(jti: string) {
    return this.prismaService.revokedJwt.findUnique({
      where: {
        jti,
      },
    });
  }

  async generateTokens(userId: string) {
    const payload: JwtAuthPayload = {
      jti: uuidv7(),
      sub: userId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return { accessToken, refreshToken, jti: payload.jti };
  }

  async generateAccessToken(userId: string) {
    const payload: JwtAuthPayload = {
      jti: uuidv7(),
      sub: userId,
    };

    this.jwtService.sign(payload);
  }
}
