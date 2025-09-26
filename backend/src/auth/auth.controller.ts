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
  access_token: string;
  refresh_token: string;
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

    // Konfigurasi cookie untuk ACCESS TOKEN (berdurasi singkat)
    res.cookie('access_token', token.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, // 15 menit
    });

    // Konfigurasi cookie untuk REFRESH TOKEN (berdurasi panjang)
    res.cookie('refresh_token', token.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 hari
    });

    return {
      data: {
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
      },
      pagination: null,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<WebResponseModel<{ success: boolean }>> {
    await this.authService.signOut(req.user?.id!);

    // Hapus access_token
    res.clearCookie('access_token');

    // Hapus refresh_token
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return {
      data: {
        success: true,
      },
      pagination: null,
    };
  }

  @Get('session')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtAuthGuard)
  async refresh(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
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

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, // 15 menit
    });

    return {
      data: {
        access_token: newAccessToken,
      },
      pagination: null,
    };
  }
}
