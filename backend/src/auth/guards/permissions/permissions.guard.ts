import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/common/decorators/permissions.decorator';
import { AuthUserObject } from 'src/auth/types/authenticated-request';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    //  Mendapatkan permissions yang dibutuhkan dari metadata decorator @Permissions()
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Jika tidak ada decorator @Permissions(), maka route dianggap publik (oleh guard ini)
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Mendapatkan objek user dari request (yang sudah disuntikkan oleh JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user: AuthUserObject = request.user;

    // Jika user tidak ada atau tidak punya property permissions, tolak akses
    if (!user || !user.permissions) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Membandingkan permissions yang dimiliki user dengan yang dibutuhkan oleh route
    const hasAllPermissions = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Jika semua permissions yang dibutuhkan ada, izinkan akses
    return true;
  }
}
