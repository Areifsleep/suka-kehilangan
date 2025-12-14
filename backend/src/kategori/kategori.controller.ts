import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { KategoriService } from './kategori.service';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

@Controller('kategori')
@UseGuards(JwtAuthGuard)
export class KategoriController {
  constructor(private readonly kategoriService: KategoriService) {}

  /**
   * Get all categories
   * PUBLIC (authenticated) - untuk dropdown/filter
   * Support pagination dengan query params: page, limit, search
   */
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;

    // Jika ada pagination params, gunakan findAllPaginated
    if (pageNum || limitNum || search) {
      return await this.kategoriService.findAllPaginated({
        page: pageNum,
        limit: limitNum,
        search,
      });
    }

    // Jika tidak, return semua data (untuk dropdown)
    const data = await this.kategoriService.findAll();
    return {
      data,
    };
  }

  /**
   * Get category by ID
   * PUBLIC (authenticated)
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.kategoriService.findOne(id);

    return {
      data,
    };
  }

  /**
   * Create new category
   * ADMIN only
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateKategoriDto) {
    const data = await this.kategoriService.create(dto);

    return {
      message: 'Kategori berhasil dibuat',
      data,
    };
  }

  /**
   * Update category
   * ADMIN only
   */
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateKategoriDto) {
    const data = await this.kategoriService.update(id, dto);

    return {
      message: 'Kategori berhasil diupdate',
      data,
    };
  }

  /**
   * Delete category
   * ADMIN only
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return await this.kategoriService.delete(id);
  }
}
