import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { StatusBarang } from '@prisma/client';
import { CreateBarangTemuanDto } from './dto/create-barang-temuan.dto';
import { UpdateBarangTemuanDto } from './dto/update-barang-temuan.dto';
import { MarkDiambilDto } from './dto/mark-diambil.dto';
import { FilterBarangTemuanDto } from './dto/filter-barang-temuan.dto';

@Injectable()
export class BarangTemuanService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  /**
   * Transform foto_barang URLs from keys to full URLs
   * Handle both:
   * - Local keys: "foto-barang/123.png" -> "http://localhost:3000/uploads/foto-barang/123.png"
   * - External URLs: "https://..." -> keep as is
   * - Already transformed local URLs: keep as is
   */
  private transformFotoUrls(barang: any) {
    if (barang.foto_barang && Array.isArray(barang.foto_barang)) {
      barang.foto_barang = barang.foto_barang.map((foto) => {
        let urlGambar = foto.url_gambar;

        // Check if it's already a full URL (starts with http:// or https://)
        if (urlGambar && !urlGambar.startsWith('http')) {
          // It's a local key, transform it to full URL
          urlGambar = this.storageService.getPublicUrl(urlGambar);
        }

        return {
          ...foto,
          url_gambar: urlGambar,
        };
      });
    }
    return barang;
  }

  /**
   * Create barang temuan baru (Petugas only)
   */
  async create(
    dto: CreateBarangTemuanDto,
    pencatatId: string,
    fotoUrls: { url: string; originalName: string; mimeType: string }[],
  ) {
    // Validate kategori exists
    const kategori = await this.prisma.kategoriBarang.findUnique({
      where: { id: dto.kategori_id },
    });

    if (!kategori) {
      throw new BadRequestException('Kategori tidak ditemukan');
    }

    // Create barang with photos in transaction
    const barang = await this.prisma.barangTemuan.create({
      data: {
        pencatat_id: pencatatId,
        kategori_id: dto.kategori_id,
        nama_barang: dto.nama_barang,
        deskripsi: dto.deskripsi,
        tanggal_ditemukan: new Date(dto.tanggal_ditemukan),
        lokasi_umum: dto.lokasi_umum,
        lokasi_spesifik: dto.lokasi_spesifik,
        perkiraan_waktu_ditemukan: dto.perkiraan_waktu_ditemukan,
        nama_penemu: dto.nama_penemu,
        nomor_hp_penemu: dto.nomor_hp_penemu,
        identitas_penemu: dto.identitas_penemu,
        email_penemu: dto.email_penemu,
        catatan_penemu: dto.catatan_penemu,
        status: StatusBarang.BELUM_DIAMBIL,
        foto_barang: {
          create: fotoUrls.map((foto) => ({
            url_gambar: foto.url,
            nama_file_asli: foto.originalName,
            mime_type: foto.mimeType,
          })),
        },
      },
      include: {
        foto_barang: true,
        kategori: true,
        pencatat: {
          select: {
            id: true,
            profile: {
              select: {
                full_name: true,
                lokasi_pos: true,
              },
            },
          },
        },
      },
    });

    return this.transformFotoUrls(barang);
  }

  /**
   * Get list barang temuan with filters
   * - User: hanya BELUM_DIAMBIL
   * - Petugas: semua (filter by lokasi_pos optional)
   * - Admin: semua
   */
  async findAll(
    filter: FilterBarangTemuanDto,
    userRole: string,
    userId?: string,
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      kategori_id,
      dateFrom,
      dateTo,
      lokasi_pos,
    } = filter;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Role-based filtering
    if (userRole === 'USER') {
      // User hanya bisa lihat barang BELUM_DIAMBIL
      where.status = StatusBarang.BELUM_DIAMBIL;
    } else if (userRole === 'PETUGAS' && lokasi_pos) {
      // Petugas bisa filter by lokasi_pos
      where.pencatat = {
        profile: {
          lokasi_pos: lokasi_pos,
        },
      };
    }

    // Apply filters
    if (status) {
      where.status = status;
    }

    if (kategori_id) {
      where.kategori_id = kategori_id;
    }

    if (search) {
      where.OR = [
        { nama_barang: { contains: search } },
        { lokasi_umum: { contains: search } },
        { lokasi_spesifik: { contains: search } },
        { deskripsi: { contains: search } },
      ];
    }

    if (dateFrom || dateTo) {
      where.tanggal_ditemukan = {};
      if (dateFrom) {
        where.tanggal_ditemukan.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.tanggal_ditemukan.lte = new Date(dateTo);
      }
    }

    // Execute query with pagination
    const [items, total] = await Promise.all([
      this.prisma.barangTemuan.findMany({
        where,
        include: {
          foto_barang: true,
          kategori: {
            select: {
              id: true,
              nama: true,
            },
          },
          pencatat: {
            select: {
              id: true,
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
              profile: {
                select: {
                  full_name: true,
                  lokasi_pos: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.barangTemuan.count({ where }),
    ]);

    // Transform foto URLs for all items
    const transformedItems = items.map((item) => this.transformFotoUrls(item));

    return {
      data: transformedItems,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get detail barang by ID
   */
  async findOne(id: string) {
    const barang = await this.prisma.barangTemuan.findUnique({
      where: { id },
      include: {
        foto_barang: true,
        foto_bukti_klaim: true,
        kategori: true,
        pencatat: {
          select: {
            id: true,
            role: {
              select: {
                id: true,
                name: true,
              },
            },
            profile: {
              select: {
                full_name: true,
                lokasi_pos: true,
                phone_number: true,
              },
            },
          },
        },
        penyerah: {
          select: {
            id: true,
            role: {
              select: {
                id: true,
                name: true,
              },
            },
            profile: {
              select: {
                full_name: true,
                lokasi_pos: true,
              },
            },
          },
        },
      },
    });

    if (!barang) {
      throw new NotFoundException(`Barang dengan ID ${id} tidak ditemukan`);
    }

    // Transform foto URLs including foto_bukti_klaim
    this.transformFotoUrls(barang);
    if (barang.foto_bukti_klaim && Array.isArray(barang.foto_bukti_klaim)) {
      barang.foto_bukti_klaim = barang.foto_bukti_klaim.map((foto) => {
        let urlGambar = foto.url_gambar;

        // Check if it's already a full URL
        if (urlGambar && !urlGambar.startsWith('http')) {
          urlGambar = this.storageService.getPublicUrl(urlGambar);
        }

        return {
          ...foto,
          url_gambar: urlGambar,
        };
      });
    }

    return barang;
  }

  /**
   * Update barang temuan
   * Hanya pencatat atau admin yang bisa update
   */
  async update(
    id: string,
    dto: UpdateBarangTemuanDto,
    updaterId: string,
    userRole: string,
    newFotoUrls?: { url: string; originalName: string; mimeType: string }[],
  ) {
    const barang = await this.findOne(id);

    // Authorization check: hanya pencatat atau admin
    if (userRole !== 'ADMIN' && barang.pencatat_id !== updaterId) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk mengubah barang ini',
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (dto.nama_barang) updateData.nama_barang = dto.nama_barang;
    if (dto.kategori_id) {
      // Validate kategori
      const kategori = await this.prisma.kategoriBarang.findUnique({
        where: { id: dto.kategori_id },
      });
      if (!kategori) {
        throw new BadRequestException('Kategori tidak ditemukan');
      }
      updateData.kategori_id = dto.kategori_id;
    }
    if (dto.deskripsi !== undefined) updateData.deskripsi = dto.deskripsi;
    if (dto.tanggal_ditemukan)
      updateData.tanggal_ditemukan = new Date(dto.tanggal_ditemukan);
    if (dto.lokasi_umum !== undefined) updateData.lokasi_umum = dto.lokasi_umum;
    if (dto.lokasi_spesifik !== undefined)
      updateData.lokasi_spesifik = dto.lokasi_spesifik;
    if (dto.perkiraan_waktu_ditemukan !== undefined)
      updateData.perkiraan_waktu_ditemukan = dto.perkiraan_waktu_ditemukan;
    if (dto.nama_penemu) updateData.nama_penemu = dto.nama_penemu;
    if (dto.nomor_hp_penemu) updateData.nomor_hp_penemu = dto.nomor_hp_penemu;
    if (dto.identitas_penemu !== undefined)
      updateData.identitas_penemu = dto.identitas_penemu;
    if (dto.email_penemu !== undefined)
      updateData.email_penemu = dto.email_penemu;
    if (dto.catatan_penemu !== undefined)
      updateData.catatan_penemu = dto.catatan_penemu;

    // Add new photos if provided
    if (newFotoUrls && newFotoUrls.length > 0) {
      updateData.foto_barang = {
        create: newFotoUrls.map((foto) => ({
          url_gambar: foto.url,
          nama_file_asli: foto.originalName,
          mime_type: foto.mimeType,
        })),
      };
    }

    const updatedBarang = await this.prisma.barangTemuan.update({
      where: { id },
      data: updateData,
      include: {
        foto_barang: true,
        kategori: true,
        pencatat: {
          select: {
            id: true,
            profile: {
              select: {
                full_name: true,
                lokasi_pos: true,
              },
            },
          },
        },
      },
    });

    return this.transformFotoUrls(updatedBarang);
  }

  /**
   * Mark barang sebagai SUDAH_DIAMBIL
   * Set data pengambil dan upload foto bukti
   */
  async markDiambil(
    id: string,
    dto: MarkDiambilDto,
    penyerahId: string,
    fotoBuktiUrls: { url: string; originalName: string; mimeType: string }[],
  ) {
    const barang = await this.findOne(id);

    // Validasi: barang harus BELUM_DIAMBIL
    if (barang.status === StatusBarang.SUDAH_DIAMBIL) {
      throw new BadRequestException('Barang sudah pernah diambil sebelumnya');
    }

    // Update status dan data pengambilan
    const updatedBarang = await this.prisma.barangTemuan.update({
      where: { id },
      data: {
        status: StatusBarang.SUDAH_DIAMBIL,
        penyerah_id: penyerahId,
        waktu_diambil: new Date(),
        nama_pengambil: dto.nama_pengambil,
        identitas_pengambil: dto.identitas_pengambil,
        kontak_pengambil: dto.kontak_pengambil,
        keterangan_klaim: dto.keterangan_klaim,
        foto_bukti_klaim: {
          create: fotoBuktiUrls.map((foto) => ({
            url_gambar: foto.url,
            nama_file_asli: foto.originalName,
            mime_type: foto.mimeType,
          })),
        },
      },
      include: {
        foto_barang: true,
        foto_bukti_klaim: true,
        kategori: true,
        pencatat: {
          select: {
            id: true,
            profile: {
              select: {
                full_name: true,
                lokasi_pos: true,
              },
            },
          },
        },
        penyerah: {
          select: {
            id: true,
            profile: {
              select: {
                full_name: true,
                lokasi_pos: true,
              },
            },
          },
        },
      },
    });

    // Transform foto URLs including foto_bukti_klaim
    this.transformFotoUrls(updatedBarang);
    if (
      updatedBarang.foto_bukti_klaim &&
      Array.isArray(updatedBarang.foto_bukti_klaim)
    ) {
      updatedBarang.foto_bukti_klaim = updatedBarang.foto_bukti_klaim.map(
        (foto) => {
          let urlGambar = foto.url_gambar;

          // Check if it's already a full URL
          if (urlGambar && !urlGambar.startsWith('http')) {
            urlGambar = this.storageService.getPublicUrl(urlGambar);
          }

          return {
            ...foto,
            url_gambar: urlGambar,
          };
        },
      );
    }

    return updatedBarang;
  }

  /**
   * Delete barang temuan
   * Hanya pencatat atau admin yang bisa delete
   */
  async delete(id: string, deleterId: string, userRole: string) {
    const barang = await this.findOne(id);

    // Authorization check
    if (userRole !== 'ADMIN' && barang.pencatat_id !== deleterId) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk menghapus barang ini',
      );
    }

    // Delete (cascade akan handle foto_barang & foto_bukti_klaim)
    await this.prisma.barangTemuan.delete({
      where: { id },
    });

    return {
      message: 'Barang berhasil dihapus',
      id,
    };
  }

  /**
   * Get statistics untuk petugas
   */
  async getStatsByPetugas(petugasId: string) {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalBarang,
      belumDiambil,
      sudahDiambil,
      barangHariIni,
      barangMingguIni,
      barangBulanIni,
    ] = await Promise.all([
      this.prisma.barangTemuan.count({
        where: { pencatat_id: petugasId },
      }),
      this.prisma.barangTemuan.count({
        where: {
          pencatat_id: petugasId,
          status: StatusBarang.BELUM_DIAMBIL,
        },
      }),
      this.prisma.barangTemuan.count({
        where: {
          pencatat_id: petugasId,
          status: StatusBarang.SUDAH_DIAMBIL,
        },
      }),
      this.prisma.barangTemuan.count({
        where: {
          pencatat_id: petugasId,
          created_at: { gte: startOfToday },
        },
      }),
      this.prisma.barangTemuan.count({
        where: {
          pencatat_id: petugasId,
          created_at: { gte: startOfWeek },
        },
      }),
      this.prisma.barangTemuan.count({
        where: {
          pencatat_id: petugasId,
          created_at: { gte: startOfMonth },
        },
      }),
    ]);

    return {
      total_barang: totalBarang,
      belum_diambil: belumDiambil,
      sudah_diambil: sudahDiambil,
      barang_hari_ini: barangHariIni,
      barang_minggu_ini: barangMingguIni,
      barang_bulan_ini: barangBulanIni,
    };
  }
}
