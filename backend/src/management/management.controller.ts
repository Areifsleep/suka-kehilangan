// backend/src/management/management.controller.ts
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
  BadRequestException,
} from '@nestjs/common';
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

  // Special endpoints for petugas management with lokasi_pos filter

  // GET /api/v1/management/petugas
  @Get('petugas')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getPetugas(@Query() paginationDto: PaginationDto, @Request() req) {
    const requestingUserId = req.user.id;

    // Get petugas role ID first
    const roles = await this.managementService.getRoles(requestingUserId);
    const petugasRole = roles.find(
      (role) => role.name.toLowerCase() === 'petugas',
    );

    if (!petugasRole) {
      throw new BadRequestException('Role petugas tidak ditemukan');
    }

    // Add roleId filter for petugas
    const petugasFilter = {
      ...paginationDto,
      roleId: petugasRole.id,
    };

    return this.managementService.getUsers(petugasFilter, requestingUserId);
  }

  // GET /api/v1/management/mahasiswa
  @Get('mahasiswa')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getMahasiswa(@Query() paginationDto: PaginationDto, @Request() req) {
    const requestingUserId = req.user.id;

    // Get mahasiswa role ID first
    const roles = await this.managementService.getRoles(requestingUserId);
    const mahasiswaRole = roles.find(
      (role) => role.name.toLowerCase() === 'mahasiswa',
    );

    if (!mahasiswaRole) {
      throw new BadRequestException('Role mahasiswa tidak ditemukan');
    }

    // Add roleId filter for mahasiswa
    const mahasiswaFilter = {
      ...paginationDto,
      roleId: mahasiswaRole.id,
    };

    return this.managementService.getUsers(mahasiswaFilter, requestingUserId);
  }
}
