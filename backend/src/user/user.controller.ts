import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Role } from 'src/common/constants/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  @Get()
  @Roles(Role.ADMIN)
  async getUser() {
    return {
      message: 'baik',
    };
  }
}
