// External libraries
import type { Response } from 'express';

// NestJS decorators and utilities
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

// Internal modules and services
import { AuthService } from './auth.service';
import { WebResponseModel } from 'src/models/web';

// Guards
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth/refresh-jwt-auth.guard';
import { type AuthenticatedRequest } from './types/authenticated-request';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  access_token: string;
}

interface SessionResponse {
  id: string;
}

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<WebResponseModel<LoginResponse>> {
    if (!req.user?.id) {
      throw new UnauthorizedException('Invalid authentication credentials');
    }

    const token = await this.authService.signIn(req.user.id);

    if (!token.accessToken || !token.refreshToken) {
      throw new InternalServerErrorException(
        'Failed to generate authentication tokens',
      );
    }

    return {
      data: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      },
      pagination: null,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: AuthenticatedRequest,
  ): Promise<WebResponseModel<{ success: boolean }>> {
    await this.authService.signOut(req.user?.id!);

    return {
      data: {
        success: true,
      },
      pagination: null,
    };
  }

  @Get('session')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getSession(
    @Req() req: AuthenticatedRequest,
  ): Promise<WebResponseModel<SessionResponse>> {
    if (!req.user?.id) {
      throw new UnauthorizedException('Invalid session');
    }

    return {
      data: req.user,
      pagination: null,
    };
  }

  @Get('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: AuthenticatedRequest,
  ): Promise<WebResponseModel<RefreshResponse>> {
    if (!req.user?.id) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { newAccessToken } = await this.authService.refresh(req.user.id);

    if (!newAccessToken) {
      throw new InternalServerErrorException(
        'Failed to generate new access token',
      );
    }

    return {
      data: {
        access_token: newAccessToken,
      },
      pagination: null,
    };
  }
}
