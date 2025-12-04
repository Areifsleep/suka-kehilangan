import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';
import { ReportsService } from './reports.service';
import { CreateReportDto, GetReportsQueryDto } from './dto/reports.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // GET /api/v1/reports/categories - Get report categories (public)
  @Get('categories')
  async getCategories() {
    return this.reportsService.getCategories();
  }

  // POST /api/v1/reports - Create new report
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.PETUGAS)
  @UseInterceptors(FilesInterceptor('images', 3))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createReport(
    @Body() createReportDto: CreateReportDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.reportsService.createReport(createReportDto, images, userId);
  }

  // GET /api/v1/reports/my-reports - Get user's own reports
  @Get('my-reports')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.PETUGAS, Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getMyReports(@Query() queryDto: GetReportsQueryDto, @Request() req) {
    const userId = req.user.id;
    return this.reportsService.getUserReports(userId, queryDto);
  }

  // GET /api/v1/reports/:id - Get report by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.PETUGAS, Role.ADMIN)
  async getReportById(@Param('id') reportId: string, @Request() req) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.reportsService.getReportById(reportId, userId, userRole);
  }

  // GET /api/v1/reports - Get all reports (for admin/petugas)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PETUGAS, Role.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getAllReports(@Query() queryDto: GetReportsQueryDto) {
    return this.reportsService.getAllReports(queryDto);
  }
}
