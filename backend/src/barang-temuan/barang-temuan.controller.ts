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
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BarangTemuanService } from './barang-temuan.service';
import { CreateBarangTemuanDto } from './dto/create-barang-temuan.dto';
import { UpdateBarangTemuanDto } from './dto/update-barang-temuan.dto';
import { MarkDiambilDto } from './dto/mark-diambil.dto';
import { FilterBarangTemuanDto } from './dto/filter-barang-temuan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';
import { StorageService } from '../storage/storage.service';

@Controller('barang-temuan')
@UseGuards(JwtAuthGuard)
export class BarangTemuanController {
  constructor(
    private readonly barangTemuanService: BarangTemuanService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * Create barang temuan baru
   * PETUGAS & ADMIN only
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.PETUGAS, Role.ADMIN)
  @UseInterceptors(FilesInterceptor('foto_barang', 5))
  async create(
    @Body() dto: CreateBarangTemuanDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    // Validate files
    if (!files || files.length === 0) {
      throw new BadRequestException('Minimal 1 foto barang harus diupload');
    }

    if (files.length > 5) {
      throw new BadRequestException('Maksimal 5 foto barang');
    }

    // Upload files
    const fotoUrls: { url: string; originalName: string; mimeType: string }[] =
      await Promise.all(
        files.map(async (file) => {
          const url = await this.storageService.uploadFile(file, 'foto-barang');
          return {
            url,
            originalName: file.originalname,
            mimeType: file.mimetype,
          };
        }),
      );

    const barang = await this.barangTemuanService.create(
      dto,
      req.user.id,
      fotoUrls,
    );

    return {
      message: 'Barang berhasil ditambahkan',
      data: barang,
    };
  }

  /**
   * Get list barang temuan
   * PUBLIC (authenticated) - role-based filtering
   */
  @Get()
  async findAll(@Query() filter: FilterBarangTemuanDto, @Request() req) {
    // Extract role - handle both string and object formats
    const roleValue = req.user?.role;
    const userRole =
      typeof roleValue === 'string' ? roleValue : roleValue?.name || 'USER';

    const result = await this.barangTemuanService.findAll(
      filter,
      userRole,
      req.user.id,
    );

    return result;
  }

  /**
   * Get barang temuan by ID
   * PUBLIC (authenticated)
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const barang = await this.barangTemuanService.findOne(id);

    return {
      data: barang,
    };
  }

  /**
   * Update barang temuan
   * PETUGAS & ADMIN only (dengan authorization check)
   */
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.PETUGAS, Role.ADMIN)
  @UseInterceptors(FilesInterceptor('foto_barang', 5))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBarangTemuanDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    // Upload new photos if provided
    let fotoUrls:
      | { url: string; originalName: string; mimeType: string }[]
      | undefined = undefined;
    if (files && files.length > 0) {
      if (files.length > 5) {
        throw new BadRequestException('Maksimal 5 foto barang');
      }

      fotoUrls = await Promise.all(
        files.map(async (file) => {
          const url = await this.storageService.uploadFile(file, 'foto-barang');
          return {
            url,
            originalName: file.originalname,
            mimeType: file.mimetype,
          };
        }),
      );
    }

    const userRole = req.user.role?.name || 'USER';
    const barang = await this.barangTemuanService.update(
      id,
      dto,
      req.user.id,
      userRole,
      fotoUrls,
    );

    return {
      message: 'Barang berhasil diupdate',
      data: barang,
    };
  }

  /**
   * Mark barang sebagai SUDAH_DIAMBIL
   * PETUGAS & ADMIN only
   */
  @Post(':id/diambil')
  @UseGuards(RolesGuard)
  @Roles(Role.PETUGAS, Role.ADMIN)
  @UseInterceptors(FilesInterceptor('foto_bukti_klaim', 3))
  async markDiambil(
    @Param('id') id: string,
    @Body() dto: MarkDiambilDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    // Upload foto bukti (optional)
    let fotoBuktiUrls: {
      url: string;
      originalName: string;
      mimeType: string;
    }[] = [];
    if (files && files.length > 0) {
      if (files.length > 3) {
        throw new BadRequestException('Maksimal 3 foto bukti klaim');
      }

      fotoBuktiUrls = await Promise.all(
        files.map(async (file) => {
          const url = await this.storageService.uploadFile(
            file,
            'foto-bukti-klaim',
          );
          return {
            url,
            originalName: file.originalname,
            mimeType: file.mimetype,
          };
        }),
      );
    }

    const barang = await this.barangTemuanService.markDiambil(
      id,
      dto,
      req.user.id,
      fotoBuktiUrls,
    );

    return {
      message: 'Barang berhasil ditandai sebagai sudah diambil',
      data: barang,
    };
  }

  /**
   * Delete barang temuan
   * PETUGAS & ADMIN only (dengan authorization check)
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.PETUGAS, Role.ADMIN)
  async delete(@Param('id') id: string, @Request() req) {
    const userRole = req.user.role?.name || 'USER';
    const result = await this.barangTemuanService.delete(
      id,
      req.user.id,
      userRole,
    );

    return result;
  }

  /**
   * Get statistics untuk petugas
   * PETUGAS only
   */
  @Get('stats/my-stats')
  @UseGuards(RolesGuard)
  @Roles(Role.PETUGAS)
  async getMyStats(@Request() req) {
    const stats = await this.barangTemuanService.getStatsByPetugas(req.user.id);

    return {
      data: stats,
    };
  }
}
