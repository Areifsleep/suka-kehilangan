// backend/src/management/management.service.ts
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
import { LokasiPos } from '@prisma/client';

@Injectable()
export class ManagementService {
  constructor(private readonly prisma: PrismaService) {}

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
