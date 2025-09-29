import { v7 as uuidv7 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { type ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';

import { JwtAuthPayload } from './types/jwt-claims';
import { PrismaService } from '../prisma/prisma.service';
import refreshJwtConfig from './config/refresh.jwt.config';

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
    const baseUuid = uuidv7();
    const accessJti = `acc_${baseUuid}`;
    const refreshJti = `ref_${baseUuid}`;

    const accessPayload: JwtAuthPayload = {
      jti: accessJti,
      sub: userId,
    };

    const refreshPayload: JwtAuthPayload = {
      jti: refreshJti,
      sub: userId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload),
      this.jwtService.signAsync(refreshPayload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
      accessJti,
      refreshJti,
    };
  }

  async generateAccessToken(userId: string) {
    const payload: JwtAuthPayload = {
      jti: `acc_${uuidv7()}`,
      sub: userId,
    };

    return this.jwtService.sign(payload);
  }

  async revokeJti(jti: string) {
    await this.prismaService.revokedJwt.create({
      data: { jti, expires_at: new Date() },
    });
  }

  async revokeMultipleJtis(jtis: string[]) {
    if (jtis.length === 0) return;

    await this.prismaService.revokedJwt.createMany({
      data: jtis.map((jti) => ({
        jti,
        expires_at: new Date(),
      })),
      skipDuplicates: true,
    });
  }

  async revokeTokenPair(accessJti: string, refreshJti: string) {
    await this.prismaService.revokedJwt.createMany({
      data: [
        { jti: accessJti, expires_at: new Date() },
        { jti: refreshJti, expires_at: new Date() },
      ],
    });
  }

  async revokeAccessTokenForLogout(accessJti: string) {
    // Revoke current access token during logout
    await this.revokeJti(accessJti);
  }

  async decode(token: string) {
    return this.jwtService.verifyAsync<JwtAuthPayload>(token, {
      ignoreExpiration: false,
      secret: this.refreshTokenConfig.secret,
    });
  }

  async decodeAccessToken(token: string) {
    return this.jwtService.verifyAsync<JwtAuthPayload>(token, {
      ignoreExpiration: false,
    });
  }

  isAccessTokenJti(jti: string): boolean {
    return jti.startsWith('acc_');
  }

  isRefreshTokenJti(jti: string): boolean {
    return jti.startsWith('ref_');
  }
}
