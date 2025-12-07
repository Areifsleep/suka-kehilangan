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

  // GET /api/v1/management/users
  @Get('users')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getUsers(@Query() paginationDto: PaginationDto, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getUsers(paginationDto, requestingUserId);
  }

  // GET /api/v1/management/users/:id
  @Get('users/:id')
  async getUserById(@Param('id') userId: string, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getUserById(userId, requestingUserId);
  }

  // POST /api/v1/management/users
  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.createUser(createUserDto, requestingUserId);
  }

  // PUT /api/v1/management/users/:id
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

  // DELETE /api/v1/management/users/:id
  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') userId: string, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.deleteUser(userId, requestingUserId);
  }

  // PUT /api/v1/management/users/:id/reset-password
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

  // GET /api/v1/management/roles
  @Get('roles')
  async getRoles(@Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getRoles(requestingUserId);
  }

  // GET /api/v1/management/study-programs
  @Get('study-programs')
  async getStudyPrograms(@Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getStudyPrograms(requestingUserId);
  }

  // GET /api/v1/management/petugas
  @Get('petugas')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getPetugas(@Query() paginationDto: PaginationDto, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getPetugasUsers(
      paginationDto,
      requestingUserId,
    );
  }

  // GET /api/v1/management/regular-users
  @Get('regular-users')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getRegularUsers(@Query() paginationDto: PaginationDto, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getRegularUsers(
      paginationDto,
      requestingUserId,
    );
  }

  // GET /api/v1/management/barang-temuan
  @Get('barang-temuan')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getBarangTemuan(@Query() paginationDto: PaginationDto, @Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getBarangTemuan(
      paginationDto,
      requestingUserId,
    );
  }

  // GET /api/v1/management/barang-temuan-stats
  @Get('barang-temuan-stats')
  async getBarangTemuanStats(@Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getBarangTemuanStats(requestingUserId);
  }

  // GET /api/v1/management/barang-temuan/export
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

  // GET /api/v1/management/dashboard/stats
  @Get('dashboard/stats')
  async getDashboardStats(@Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getDashboardStats(requestingUserId);
  }

  // GET /api/v1/management/dashboard/activities
  @Get('dashboard/activities')
  async getRecentActivities(@Request() req) {
    const requestingUserId = req.user.id;
    return this.managementService.getRecentActivities(requestingUserId);
  }
}
