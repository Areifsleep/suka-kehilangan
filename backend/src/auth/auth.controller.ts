import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dtos/login.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login() {}

  @Post('logout')
  async logout() {}

  @Get('session')
  async getSession(@Body() request: LoginBodyDto) {
    return {
      success: true,
    };
  }
}
