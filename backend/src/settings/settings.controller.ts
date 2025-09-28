// backend/src/settings/settings.controller.ts
import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { SettingsService } from './settings.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/settings.dto';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // ✅ GET /api/v1/settings/profile
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.id;
    return this.settingsService.getProfile(userId);
  }

  // ✅ PUT /api/v1/settings/profile
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    return this.settingsService.updateProfile(userId, updateProfileDto);
  }

  // ✅ PUT /api/v1/settings/change-password
  @Put('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.id;
    return this.settingsService.changePassword(userId, changePasswordDto);
  }
}
