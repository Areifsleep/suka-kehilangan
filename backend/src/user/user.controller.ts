import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions/permissions.guard';
import { Permission } from 'src/common/constants/permissions.enum';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserController {
  @Get()
  @Permissions([Permission.ManageUsers])
  async getUser() {
    return {
      message: 'baik',
    };
  }
}
