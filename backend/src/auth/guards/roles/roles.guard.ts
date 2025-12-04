import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/roles.enum';
import { AuthUserObject } from 'src/auth/types/authenticated-request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Mendapatkan roles yang dibutuhkan dari metadata decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Jika tidak ada decorator @Roles(), maka route dianggap publik (oleh guard ini)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Mendapatkan objek user dari request (yang sudah disuntikkan oleh JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user: AuthUserObject = request.user;

    // Jika user tidak ada atau tidak punya property role, tolak akses
    if (!user || !user.role) {
      throw new ForbiddenException('Izin tidak memadai');
    }

    // Memeriksa apakah role user termasuk dalam required roles
    const hasRequiredRole = requiredRoles.includes(user.role as Role);

    if (!hasRequiredRole) {
      throw new ForbiddenException('Izin tidak memadai');
    }

    // Jika role user sesuai, izinkan akses
    return true;
  }
}
