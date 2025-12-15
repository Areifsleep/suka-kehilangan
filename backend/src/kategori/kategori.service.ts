import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KategoriService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Get all categories (public - untuk dropdown/filter)
   */
  async findAll() {
    return await this.prismaService.kategoriBarang.findMany({
      select: {
        id: true,
        nama: true,
        deskripsi: true,
        created_at: true,
        _count: {
          select: {
            daftar_barang: true,
          },
        },
      },
      orderBy: {
        nama: 'asc',
      },
    });
  }

  /**
   * Get all categories with pagination (untuk management page)
   */
  async findAllPaginated(params: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (params.search) {
      where.OR = [
        { nama: { contains: params.search } },
        { deskripsi: { contains: params.search } },
      ];
    }

    // Get total count
    const total = await this.prismaService.kategoriBarang.count({ where });

    // Get paginated data
    const data = await this.prismaService.kategoriBarang.findMany({
      where,
      select: {
        id: true,
        nama: true,
        deskripsi: true,
        created_at: true,
        _count: {
          select: {
            daftar_barang: true,
          },
        },
      },
      orderBy: {
        nama: 'asc',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get category by ID
   */
  async findOne(id: string) {
    const kategori = await this.prismaService.kategoriBarang.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
        deskripsi: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            daftar_barang: true,
          },
        },
      },
    });

    if (!kategori) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    return kategori;
  }

  /**
   * Create new category (ADMIN only)
   */
  async create(data: { nama: string; deskripsi?: string }) {
    // Check duplicate
    const existing = await this.prismaService.kategoriBarang.findUnique({
      where: { nama: data.nama },
    });

    if (existing) {
      throw new ConflictException('Kategori dengan nama tersebut sudah ada');
    }

    return await this.prismaService.kategoriBarang.create({
      data: {
        nama: data.nama,
        deskripsi: data.deskripsi,
      },
    });
  }

  /**
   * Update category (ADMIN only)
   */
  async update(id: string, data: { nama?: string; deskripsi?: string }) {
    // Check exists
    const kategori = await this.prismaService.kategoriBarang.findUnique({
      where: { id },
    });

    if (!kategori) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    // Check duplicate nama if updating nama
    if (data.nama && data.nama !== kategori.nama) {
      const existing = await this.prismaService.kategoriBarang.findUnique({
        where: { nama: data.nama },
      });

      if (existing) {
        throw new ConflictException('Kategori dengan nama tersebut sudah ada');
      }
    }

    return await this.prismaService.kategoriBarang.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete category (ADMIN only)
   * Note: Will fail if category has associated barang (CASCADE)
   */
  async delete(id: string) {
    // Check exists
    const kategori = await this.prismaService.kategoriBarang.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            daftar_barang: true,
          },
        },
      },
    });

    if (!kategori) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    if (kategori._count.daftar_barang > 0) {
      throw new ConflictException(
        `Tidak dapat menghapus kategori yang masih memiliki ${kategori._count.daftar_barang} barang`,
      );
    }

    await this.prismaService.kategoriBarang.delete({
      where: { id },
    });

    return {
      message: 'Kategori berhasil dihapus',
    };
  }
}
