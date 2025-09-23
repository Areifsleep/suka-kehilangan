import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';

import { JwtAuthPayload } from '../types/jwt-claims';
import refreshJwtConfig from '../config/refresh.jwt.config';
import { Request } from 'express';
import { TokenService } from '../token.service';
import argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshJwtConfiguration: ConfigType<
      typeof refreshJwtConfig
    >,
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Dari Authorization Bearer
        ExtractJwt.fromAuthHeaderAsBearerToken(),

        // Dari Cookie
        (req: Request) => {
          if (req && req.cookies) {
            return req.cookies['refresh_token'];
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: refreshJwtConfiguration.secret ?? '',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtAuthPayload) {
    if (!payload || !payload.jti) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Cek blacklist dulu jika Anda masih mau menggunakannya
    const isBlacklisted = await this.tokenService.isBlacklisted(payload.jti);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // Cari sesi SPESIFIK berdasarkan JTI. Ini sangat cepat!
    const userSession = await this.prismaService.session.findUnique({
      where: { jti: payload.jti },
    });

    if (!userSession) {
      throw new UnauthorizedException(
        'Session not found. Please log in again.',
      );
    }

    // Ambil token mentah dari request
    const rawRefreshToken =
      req?.cookies?.['refresh_token'] ??
      req?.headers?.['authorization']?.split(' ')[1];
    if (!rawRefreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    //  Bandingkan hash
    const isTokenMatch = await argon2.verify(
      userSession.hashed_refresh_token,
      rawRefreshToken,
    );
    if (!isTokenMatch) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    // Jika semua validasi lolos
    return { id: payload.sub, jti: payload.jti };
  }
}
