import ms from 'ms';
import argon2 from 'argon2';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import refreshJwtConfig from './config/refresh.jwt.config';
import { type ConfigType } from '@nestjs/config';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(username: string, password: string) {
    const existingUser =
      await this.userService.findByUsernameWithAllPermissions(username);

    const unauthorizedConditions =
      !existingUser ||
      (await argon2.verify(existingUser.password, password)) === false;

    if (unauthorizedConditions) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return { id: existingUser.id };
  }

  async signIn(userId: string) {
    const tokens = await this.tokenService.generateTokens(userId);

    const expiresIn = this.refreshTokenConfig.expiresIn; // bisa "1d", "3600", dll
    const ttlMs =
      typeof expiresIn === 'string' ? ms(expiresIn) : expiresIn! * 1000;

    const expiresAt = new Date(Date.now() + ttlMs);

    const hashedRefreshToken = await argon2.hash(tokens.refreshToken);

    await this.prismaService.session.upsert({
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
  }

  async refresh(userId: string) {
    const newAccessToken = await this.tokenService.generateAccessToken(userId);
    return { newAccessToken };
  }

  async signOut(userId: string) {
    this.prismaService.$transaction(async ($tx) => {
      const data = await $tx.session.delete({
        where: { user_id: userId },
      });

      await this.tokenService.revokeJti(data.jti);
    });
  }

  async getSession() {}

  async changePassword() {}
}
