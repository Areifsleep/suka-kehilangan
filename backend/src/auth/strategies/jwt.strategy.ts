import { Request } from 'express';
import { type ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import jwtConfig from '../config/jwt.config';
import { TokenService } from '../token.service';
import { JwtAuthPayload } from '../types/jwt-claims';
import { UserService } from '../../user/user.service';
import { AuthUserObject } from '../types/authenticated-request';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Dari Authorization Bearer
        ExtractJwt.fromAuthHeaderAsBearerToken(),

        // Dari Cookie
        (req: Request) => {
          if (req && req.cookies) {
            return req.cookies['access_token'];
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret ?? '',
    });
  }

  async validate(payload: JwtAuthPayload) {
    if (!payload) {
      throw new UnauthorizedException('Token is not provided');
    }
    //  cek apakah token di-blacklist
    const isBlacklisted = await this.tokenService.isBlacklisted(payload.jti);

    if (isBlacklisted) {
      throw new UnauthorizedException('This token is not valid');
    }

    // Populate Permissions User
    const user = await this.userService.findByIdWithAllPermissions(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userToSendinRequest: AuthUserObject = {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      role: user.role.name,
      permissions: user.role.role_permissions.map((p) => p.permission.name),
    };
    return userToSendinRequest;
  }
}
