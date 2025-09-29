import ms from 'ms';
import argon2 from 'argon2';
import { type ConfigType } from '@nestjs/config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import refreshJwtConfig from './config/refresh.jwt.config';
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
      throw new UnauthorizedException('Username atau password salah');
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

    await this.prismaService.session.create({
      data: {
        user_id: userId,
        hashed_refresh_token: hashedRefreshToken,
        expires_at: expiresAt,
        jti: tokens.refreshJti,
      },
    });

    return tokens;
  }

  async refresh(userId: string) {
    const newAccessToken = await this.tokenService.generateAccessToken(userId);
    return { newAccessToken };
  }

  async signOut(userId: string, sessionJti: string) {
    await this.prismaService.$transaction(async ($tx) => {
      // Find the session first to check if it exists and belongs to the user
      const existingSession = await $tx.session.findUnique({
        where: {
          jti: sessionJti,
        },
      });

      // If session doesn't exist, it might have been already deleted
      // This is not an error condition - just return gracefully
      if (!existingSession) {
        return;
      }

      // Verify that the session belongs to the requesting user
      if (existingSession.user_id !== userId) {
        throw new UnauthorizedException('Session tidak valid untuk user ini');
      }

      // Delete the session
      await $tx.session.delete({
        where: {
          jti: sessionJti,
        },
      });

      // Revoke the refresh token JTI
      await this.tokenService.revokeJti(sessionJti);
    });
  }

  async signOutAll(userId: string) {
    await this.prismaService.$transaction(async ($tx) => {
      // Get all sessions for user
      const sessions = await $tx.session.findMany({
        where: { user_id: userId },
        select: { jti: true },
      });

      // Delete all sessions
      await $tx.session.deleteMany({
        where: { user_id: userId },
      });

      // Revoke all refresh token JTIs
      if (sessions.length > 0) {
        await this.tokenService.revokeMultipleJtis(
          sessions.map((session) => session.jti),
        );
      }
    });
  }

  async getUserSessions(userId: string) {
    return this.prismaService.session.findMany({
      where: {
        user_id: userId,
        expires_at: {
          gt: new Date(), // Only return non-expired sessions
        },
      },
      select: {
        id: true,
        jti: true,
        expires_at: true,
      },
    });
  }

  async validateRefreshToken(refreshToken: string, sessionJti: string) {
    const session = await this.prismaService.session.findUnique({
      where: { jti: sessionJti },
    });

    if (!session || session.expires_at < new Date()) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    const isValidToken = await argon2.verify(
      session.hashed_refresh_token,
      refreshToken,
    );

    if (!isValidToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return session;
  }

  async changePassword() {}
}
