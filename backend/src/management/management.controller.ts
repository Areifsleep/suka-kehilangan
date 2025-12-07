import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Res,
} from '@nestjs/common';
import { type Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ManagementService } from './management.service';
import {
  CreateUserDto,
  UpdateUserDto,
  PaginationDto,
  ResetPasswordDto,
} from './dto/management.dto';

@Controller('management')
@UseGuards(JwtAuthGuard)
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('users')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getUsers(@Query() paginationDto: PaginationDto, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getUsers(paginationDto, requestingUserId);
  }

  @Get('users/:id')
  async getUserById(@Param('id') userId: string, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getUserById(userId, requestingUserId);
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.createUser(createUserDto, requestingUserId);
  }

  @Put('users/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    const requestingUserId = req.user.id;
    return this.managementService.updateUser(
      userId,
      updateUserDto,
      requestingUserId,
    );
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') userId: string, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.deleteUser(userId, requestingUserId);
  }

  @Put('users/:id/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('id') userId: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Request() req,
  ) {
    const requestingUserId = req.user.id;
    return this.managementService.resetPassword(
      userId,
      resetPasswordDto,
      requestingUserId,
    );
  }

  @Get('roles')
  async getRoles(@Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getRoles(requestingUserId);
  }

  @Get('study-programs')
  async getStudyPrograms(@Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getStudyPrograms(requestingUserId);
  }

  @Get('petugas')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getPetugas(@Query() paginationDto: PaginationDto, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getPetugasUsers(
      paginationDto,
      requestingUserId,
    );
  }

  @Get('regular-users')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getRegularUsers(@Query() paginationDto: PaginationDto, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getRegularUsers(
      paginationDto,
      requestingUserId,
    );
  }

  @Get('barang-temuan')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getBarangTemuan(@Query() paginationDto: PaginationDto, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getBarangTemuan(
      paginationDto,
      requestingUserId,
    );
  }

  @Get('barang-temuan-stats')
  async getBarangTemuanStats(@Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getBarangTemuanStats(requestingUserId);
  }

  @Get('barang-temuan/export')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async exportBarangTemuan(
    @Query() queryDto: PaginationDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const requestingUserId = req.user.id;
    const result = await this.managementService.exportBarangTemuanToPDF(
      queryDto,
      requestingUserId,
    );

    const buffer = Buffer.from(result.buffer, 'base64');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${result.filename}"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  }

  @Get('dashboard/stats')
  async getDashboardStats(@Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getDashboardStats(requestingUserId);
  }

  @Get('dashboard/activities')
  async getRecentActivities(@Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getRecentActivities(requestingUserId);
  }
}
