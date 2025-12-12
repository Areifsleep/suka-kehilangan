import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Get dashboard untuk USER
   * Menampilkan barang tersedia dan statistik
   */
  @Get('user')
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  async getUserDashboard() {
    const data = await this.dashboardService.getUserDashboard();

    return {
      data,
    };
  }

  /**
   * Get dashboard untuk PETUGAS
   * Menampilkan statistik barang yang dicatat petugas
   */
  @Get('petugas')
  @UseGuards(RolesGuard)
  @Roles(Role.PETUGAS)
  async getPetugasDashboard(@Request() req) {
    const data = await this.dashboardService.getPetugasDashboard(req.user.id);

    return {
      data,
    };
  }

  /**
   * Get dashboard untuk ADMIN
   * Menampilkan statistik keseluruhan sistem
   */
  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async getAdminDashboard() {
    const data = await this.dashboardService.getAdminDashboard();

    return {
      data,
    };
  }

  /**
   * Get dashboard otomatis berdasarkan role user
   * Smart routing endpoint
   */
  @Get()
  async getDashboard(@Request() req) {
    const userRole = req.user.role?.name || 'USER';

    let data;
    switch (userRole) {
      case 'ADMIN':
        data = await this.dashboardService.getAdminDashboard();
        break;
      case 'PETUGAS':
        data = await this.dashboardService.getPetugasDashboard(req.user.id);
        break;
      default:
        data = await this.dashboardService.getUserDashboard();
    }

    return {
      role: userRole,
      data,
    };
  }
}
