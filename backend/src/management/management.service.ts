import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserDto,
  UpdateUserDto,
  PaginationDto,
  ResetPasswordDto,
} from './dto/management.dto';
import { LokasiPos, StatusBarang } from '@prisma/client';
import { PdfGeneratorService } from '../common/services/pdf-generator.service';

@Injectable()
export class ManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfGenerator: PdfGeneratorService,
  ) {}

  // Get all users with pagination and filters
  async getUsers(params: PaginationDto, requestingUserId: string) {
    await this.validateAdminAccess(requestingUserId);

    const { page = 1, limit = 20, search, roleId, lokasiPos } = params;
    const skip = (page - 1) * limit;

    // Build where conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search } },
        {
          profile: {
            OR: [
              { full_name: { contains: search } },
              { email: { contains: search } },
              { nim: { contains: search } },
              { nip: { contains: search } },
            ],
          },
        },
      ];
    }

    if (roleId) {
      where.role_id = roleId;
    }

    if (lokasiPos) {
      where.profile = {
        ...where.profile,
        lokasi_pos: lokasiPos,
      };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          role_id: true,
          created_at: true,
          updated_at: true,
          profile: {
            select: {
              email: true,
              full_name: true,
              nim: true,
              nip: true,
              study_program_id: true,
              lokasi_pos: true,
              study_program: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  level: true,
                  faculty: {
                    select: {
                      id: true,
                      name: true,
                      abbreviation: true,
                    },
                  },
                },
              },
            },
          },
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
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

  // Get regular users (exclude admin and petugas)
  async getRegularUsers(params: PaginationDto, requestingUserId: string) {
    await this.validateAdminAccess(requestingUserId);

    const { page = 1, limit = 20, search } = params;
    const skip = (page - 1) * limit;

    // Get USER role ID
    const userRole = await this.prisma.role.findFirst({
      where: { name: 'USER' },
    });

    if (!userRole) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    // Build where conditions
    const where: any = {
      role_id: userRole.id,
    };

    if (search) {
      where.OR = [
        { username: { contains: search } },
        {
          profile: {
            OR: [
              { full_name: { contains: search } },
              { email: { contains: search } },
              { nim: { contains: search } },
            ],
          },
        },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          role_id: true,
          created_at: true,
          updated_at: true,
          profile: {
            select: {
              email: true,
              full_name: true,
              nim: true,
              study_program_id: true,
              study_program: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  level: true,
                  faculty: {
                    select: {
                      id: true,
                      name: true,
                      abbreviation: true,
                    },
                  },
                },
              },
            },
          },
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
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

  // Get petugas users only
  async getPetugasUsers(params: PaginationDto, requestingUserId: string) {
    await this.validateAdminAccess(requestingUserId);

    const { page = 1, limit = 20, search, lokasiPos } = params;
    const skip = (page - 1) * limit;

    // Get PETUGAS role ID
    const petugasRole = await this.prisma.role.findFirst({
      where: { name: 'PETUGAS' },
    });

    if (!petugasRole) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    // Build where conditions
    const where: any = {
      role_id: petugasRole.id,
    };

    if (search) {
      where.OR = [
        { username: { contains: search } },
        {
          profile: {
            OR: [
              { full_name: { contains: search } },
              { email: { contains: search } },
            ],
          },
        },
      ];
    }

    if (lokasiPos) {
      where.profile = {
        ...where.profile,
        lokasi_pos: lokasiPos,
      };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          role_id: true,
          created_at: true,
          updated_at: true,
          profile: {
            select: {
              email: true,
              full_name: true,
              lokasi_pos: true,
            },
          },
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
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

  // Get user by ID
  async getUserById(userId: string, requestingUserId: string) {
    await this.validateAdminAccess(requestingUserId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role_id: true,
        created_at: true,
        updated_at: true,
        profile: {
          select: {
            email: true,
            full_name: true,
            nim: true,
            nip: true,
            study_program_id: true,
            lokasi_pos: true,
            study_program: {
              select: {
                id: true,
                name: true,
                code: true,
                level: true,
                faculty: {
                  select: {
                    id: true,
                    name: true,
                    abbreviation: true,
                  },
                },
              },
            },
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    return user;
  }

  // Create new user
  async createUser(createUserDto: CreateUserDto, requestingUserId: string) {
    await this.validateAdminAccess(requestingUserId);

    const {
      password,
      roleId,
      email,
      fullName,
      nim,
      nip,
      studyProgramId,
      lokasiPos,
      username,
    } = createUserDto;

    // Check if username already exists
    const existingUsername = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      throw new ConflictException('Username sudah digunakan');
    }

    // Check if email already exists
    const existingEmail = await this.prisma.userProfile.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException('Email sudah digunakan');
    }

    // Check if NIM already exists (if provided)
    if (nim) {
      const existingNim = await this.prisma.userProfile.findUnique({
        where: { nim },
      });

      if (existingNim) {
        throw new ConflictException('NIM sudah digunakan');
      }
    }

    // Check if NIP already exists (if provided)
    if (nip) {
      const existingNip = await this.prisma.userProfile.findUnique({
        where: { nip },
      });

      if (existingNip) {
        throw new ConflictException('NIP sudah digunakan');
      }
    }

    // Verify role exists
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new BadRequestException('Role tidak valid');
    }

    // Verify study program exists (if provided)
    if (studyProgramId) {
      const studyProgram = await this.prisma.studyProgram.findUnique({
        where: { id: studyProgramId },
      });

      if (!studyProgram) {
        throw new BadRequestException('Program studi tidak valid');
      }
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create user with profile
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role_id: roleId,
        profile: {
          create: {
            email,
            full_name: fullName,
            nim,
            nip,
            study_program_id: studyProgramId,
            lokasi_pos: lokasiPos,
          },
        },
      },
      select: {
        id: true,
        username: true,
        role_id: true,
        created_at: true,
        profile: {
          select: {
            email: true,
            full_name: true,
            nim: true,
            nip: true,
            study_program_id: true,
            lokasi_pos: true,
            study_program: {
              select: {
                id: true,
                name: true,
                code: true,
                level: true,
                faculty: {
                  select: {
                    id: true,
                    name: true,
                    abbreviation: true,
                  },
                },
              },
            },
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  // Update user
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    requestingUserId: string,
  ) {
    await this.validateAdminAccess(requestingUserId);

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!existingUser) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const {
      username,
      roleId,
      email,
      fullName,
      nim,
      nip,
      studyProgramId,
      lokasiPos,
    } = updateUserDto;

    // Check uniqueness constraints
    if (username && username !== existingUser.username) {
      const existingUsername = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUsername) {
        throw new ConflictException('Username sudah digunakan');
      }
    }

    if (email && email !== existingUser.profile?.email) {
      const existingEmail = await this.prisma.userProfile.findUnique({
        where: { email },
      });

      if (existingEmail) {
        throw new ConflictException('Email sudah digunakan');
      }
    }

    if (nim && nim !== existingUser.profile?.nim) {
      const existingNim = await this.prisma.userProfile.findUnique({
        where: { nim },
      });

      if (existingNim) {
        throw new ConflictException('NIM sudah digunakan');
      }
    }

    if (nip && nip !== existingUser.profile?.nip) {
      const existingNip = await this.prisma.userProfile.findUnique({
        where: { nip },
      });

      if (existingNip) {
        throw new ConflictException('NIP sudah digunakan');
      }
    }

    // Verify role exists (if provided)
    if (roleId) {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
      });

      if (!role) {
        throw new BadRequestException('Role tidak valid');
      }
    }

    // Verify study program exists (if provided)
    if (studyProgramId) {
      const studyProgram = await this.prisma.studyProgram.findUnique({
        where: { id: studyProgramId },
      });

      if (!studyProgram) {
        throw new BadRequestException('Program studi tidak valid');
      }
    }

    // Update user and profile
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(roleId && { role_id: roleId }),
        profile: {
          update: {
            ...(email && { email }),
            ...(fullName && { full_name: fullName }),
            ...(nim !== undefined && { nim }),
            ...(nip !== undefined && { nip }),
            ...(studyProgramId !== undefined && {
              study_program_id: studyProgramId,
            }),
            ...(lokasiPos !== undefined && { lokasi_pos: lokasiPos }),
          },
        },
      },
      select: {
        id: true,
        username: true,
        role_id: true,
        updated_at: true,
        profile: {
          select: {
            email: true,
            full_name: true,
            nim: true,
            nip: true,
            study_program_id: true,
            lokasi_pos: true,
            study_program: {
              select: {
                id: true,
                name: true,
                code: true,
                level: true,
                faculty: {
                  select: {
                    id: true,
                    name: true,
                    abbreviation: true,
                  },
                },
              },
            },
          },
        },
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedUser;
  }

  // Delete user
  async deleteUser(userId: string, requestingUserId: string) {
    await this.validateAdminAccess(requestingUserId);

    // Prevent admin from deleting themselves
    if (userId === requestingUserId) {
      throw new BadRequestException('Tidak dapat menghapus akun sendiri');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Delete user (cascade will handle profile deletion)
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User berhasil dihapus' };
  }

  // Reset user password
  async resetPassword(
    userId: string,
    resetPasswordDto: ResetPasswordDto,
    requestingUserId: string,
  ) {
    await this.validateAdminAccess(requestingUserId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const hashedPassword = await argon2.hash(resetPasswordDto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        last_update_password: new Date(),
      },
    });

    return { message: 'Password berhasil direset' };
  }

  // Get roles for dropdown
  async getRoles(requestingUserId: string) {
    await this.validateAdminAccess(requestingUserId);

    return await this.prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  // Get study programs for dropdown
  async getStudyPrograms(requestingUserId: string) {
    await this.validateAdminAccess(requestingUserId);

    return await this.prisma.studyProgram.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        level: true,
        faculty: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
      },
      orderBy: [{ faculty: { name: 'asc' } }, { name: 'asc' }],
    });
  }

  // Get barang temuan (found items) for audit
  async getBarangTemuan(
    params: PaginationDto & {
      search?: string;
      status?: StatusBarang;
      categoryId?: string;
      dateRange?: 'all' | 'today' | 'week' | 'month';
    },
    requestingUserId: string,
  ) {
    await this.validateAdminAccess(requestingUserId);

    const {
      page = 1,
      limit = 20,
      search,
      status,
      categoryId,
      dateRange = 'all',
    } = params;

    const skip = (page - 1) * limit;

    // Build where conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { nama_barang: { contains: search } },
        { deskripsi: { contains: search } },
        { lokasi_ditemukan: { contains: search } },
        {
          pencatat: {
            profile: {
              full_name: { contains: search },
            },
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.kategori_id = categoryId;
    }

    // Date range filtering
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      where.created_at = {
        gte: startDate,
      };
    }

    const [barangList, total] = await Promise.all([
      this.prisma.barangTemuan.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          nama_barang: true,
          deskripsi: true,
          lokasi_ditemukan: true,
          status: true,
          created_at: true,
          updated_at: true,
          waktu_diambil: true,
          nama_pengambil: true,
          identitas_pengambil: true,
          kategori: {
            select: {
              id: true,
              nama: true,
            },
          },
          pencatat: {
            select: {
              id: true,
              profile: {
                select: {
                  full_name: true,
                  lokasi_pos: true,
                },
              },
              role: {
                select: {
                  name: true,
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
                },
              },
            },
          },
          foto_barang: {
            select: {
              url_gambar: true,
              nama_file_asli: true,
            },
            take: 1,
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.barangTemuan.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Transform data for frontend
    const transformedData = barangList.map((item) => ({
      id: item.id,
      nama_barang: item.nama_barang,
      deskripsi: item.deskripsi,
      lokasi_ditemukan: item.lokasi_ditemukan,
      status: item.status,
      kategori: item.kategori.nama,
      kategori_id: item.kategori.id,
      pencatat_name: item.pencatat.profile?.full_name || 'Unknown',
      pencatat_role: item.pencatat.role.name,
      lokasi_pos: item.pencatat.profile?.lokasi_pos,
      penyerah_name: item.penyerah?.profile?.full_name,
      nama_pengambil: item.nama_pengambil,
      identitas_pengambil: item.identitas_pengambil,
      image_url: item.foto_barang[0]?.url_gambar || null,
      created_at: item.created_at,
      updated_at: item.updated_at,
      waktu_diambil: item.waktu_diambil,
    }));

    return {
      data: transformedData,
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

  // Get barang temuan statistics
  async getBarangTemuanStats(requestingUserId: string) {
    await this.validateAdminAccess(requestingUserId);

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));

    const [totalItems, tersediaItems, sudahDiambilItems, todayItems] =
      await Promise.all([
        // Total items
        this.prisma.barangTemuan.count(),
        // Available items (TERSEDIA status)
        this.prisma.barangTemuan.count({
          where: {
            status: 'TERSEDIA',
          },
        }),
        // Claimed items (SUDAH_DIAMBIL status)
        this.prisma.barangTemuan.count({
          where: {
            status: 'SUDAH_DIAMBIL',
          },
        }),
        // Today's items
        this.prisma.barangTemuan.count({
          where: {
            created_at: {
              gte: todayStart,
            },
          },
        }),
      ]);

    // Calculate trends (comparing with yesterday)
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const yesterdayItems = await this.prisma.barangTemuan.count({
      where: {
        created_at: {
          gte: yesterdayStart,
          lt: todayStart,
        },
      },
    });

    const itemsTrend = todayItems - yesterdayItems;

    return {
      totalItems,
      tersediaItems,
      sudahDiambilItems,
      todayItems,
      trends: {
        items: itemsTrend >= 0 ? 'up' : 'down',
        itemsValue: `${itemsTrend >= 0 ? '+' : ''}${itemsTrend} dari kemarin`,
      },
    };
  }

  // Export barang temuan history to PDF
  async exportBarangTemuanToPDF(
    params: {
      search?: string;
      status?: StatusBarang;
      categoryId?: string;
      dateRange?: 'all' | 'today' | 'week' | 'month';
      startDate?: Date;
      endDate?: Date;
    },
    requestingUserId: string,
  ) {
    await this.validateAdminAccess(requestingUserId);

    const {
      search,
      status,
      categoryId,
      dateRange = 'all',
      startDate,
      endDate,
    } = params;

    // Build where conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { nama_barang: { contains: search } },
        { deskripsi: { contains: search } },
        { lokasi_ditemukan: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.kategori_id = categoryId;
    }

    // Date range filtering
    if (startDate && endDate) {
      where.created_at = {
        gte: startDate,
        lte: endDate,
      };
    } else if (dateRange !== 'all') {
      const now = new Date();
      let rangeStart = new Date();

      switch (dateRange) {
        case 'today':
          rangeStart.setHours(0, 0, 0, 0);
          break;
        case 'week':
          rangeStart.setDate(now.getDate() - 7);
          break;
        case 'month':
          rangeStart.setMonth(now.getMonth() - 1);
          break;
      }

      where.created_at = {
        gte: rangeStart,
      };
    }

    const barangList = await this.prisma.barangTemuan.findMany({
      where,
      select: {
        id: true,
        nama_barang: true,
        deskripsi: true,
        lokasi_ditemukan: true,
        status: true,
        created_at: true,
        waktu_diambil: true,
        nama_pengambil: true,
        identitas_pengambil: true,
        kontak_pengambil: true,
        kategori: {
          select: {
            nama: true,
          },
        },
        pencatat: {
          select: {
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
            profile: {
              select: {
                full_name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const exportData = {
      items: barangList,
      filters: {
        search,
        status,
        categoryId,
        dateRange,
        startDate,
        endDate,
      },
      exportedAt: new Date(),
      exportedBy: requestingUserId,
    };

    const { buffer, filename } =
      await this.pdfGenerator.generateBarangTemuanPDF(exportData);

    return {
      buffer: buffer.toString('base64'),
      filename,
      contentType: 'application/pdf',
    };
  }

  // Get dashboard statistics
  async getDashboardStats(requestingUserId: string) {
    await this.validateAdminAccess(requestingUserId);

    // Get petugas role to count active officers
    const petugasRole = await this.prisma.role.findFirst({
      where: { name: 'PETUGAS' },
    });

    const [totalItems, tersediaItems, sudahDiambilItems, activePetugas] =
      await Promise.all([
        // Total barang temuan
        this.prisma.barangTemuan.count(),
        // Available items (TERSEDIA status)
        this.prisma.barangTemuan.count({
          where: {
            status: 'TERSEDIA',
          },
        }),
        // Claimed items (SUDAH_DIAMBIL status)
        this.prisma.barangTemuan.count({
          where: {
            status: 'SUDAH_DIAMBIL',
          },
        }),
        // Active petugas users
        petugasRole
          ? this.prisma.user.count({
              where: {
                role_id: petugasRole.id,
              },
            })
          : Promise.resolve(0),
      ]);

    return {
      totalItems,
      tersedia: tersediaItems,
      sudahDiambil: sudahDiambilItems,
      officers: activePetugas,
    };
  }

  // Get recent activities
  async getRecentActivities(requestingUserId: string) {
    await this.validateAdminAccess(requestingUserId);

    // Get recent barang temuan (max 10)
    const recentItems = await this.prisma.barangTemuan.findMany({
      take: 10,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        nama_barang: true,
        lokasi_ditemukan: true,
        status: true,
        created_at: true,
        updated_at: true,
        waktu_diambil: true,
        nama_pengambil: true,
        pencatat: {
          select: {
            profile: {
              select: {
                full_name: true,
              },
            },
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        penyerah: {
          select: {
            profile: {
              select: {
                full_name: true,
              },
            },
          },
        },
      },
    });

    // Transform to activities format
    const activities = recentItems.map((item) => {
      let title = '';
      let subtitle = '';
      let type: 'info' | 'success' | 'danger' = 'info';

      if (item.status === 'SUDAH_DIAMBIL') {
        title = `${item.nama_barang} telah diambil oleh ${item.nama_pengambil || 'pemilik'}`;
        subtitle = `Diserahkan oleh ${item.penyerah?.profile?.full_name || 'petugas'}`;
        type = 'success';
      } else {
        title = `${item.nama_barang} ditemukan di ${item.lokasi_ditemukan}`;
        subtitle = `Dicatat oleh ${item.pencatat.profile?.full_name || 'Unknown'} (${item.pencatat.role.name})`;
        type = 'info';
      }

      return {
        id: item.id,
        type,
        title,
        subtitle,
        time: this.formatRelativeTime(item.created_at),
        createdAt: item.created_at,
      };
    });

    return activities;
  }

  // Helper method to format relative time
  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return 'Baru saja';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else if (diffInDays < 7) {
      return `${diffInDays} hari yang lalu`;
    } else {
      return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  }

  // Private method to validate admin access
  private async validateAdminAccess(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    // Check if user is admin (adjust role name as needed)
    if (user.role.name.toLowerCase() !== 'admin') {
      throw new ForbiddenException(
        'Akses ditolak. Hanya admin yang dapat mengakses fitur ini',
      );
    }
  }
}
