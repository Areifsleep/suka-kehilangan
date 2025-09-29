// backend/src/settings/settings.service.ts
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  //  Get user profile - Based on your schema
  async getProfile(userId: string) {
    if (!userId || userId.trim() === '') {
      throw new BadRequestException('ID pengguna diperlukan');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        last_update_password: true,
        created_at: true,
        updated_at: true,
        //  Include UserProfile relation
        profile: {
          select: {
            email: true,
            full_name: true,
            nim: true,
            nip: true,
            study_program_id: true,
            // Include study program details
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
                    code: true,
                    abbreviation: true,
                  },
                },
              },
            },
          },
        },
        //  Include Role relation
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan');
    }

    return {
      success: true,
      message: 'Profil berhasil diambil',
      data: {
        id: user.id,
        username: user.username,
        // Profile data from UserProfile table
        email: user.profile?.email || null,
        fullName: user.profile?.full_name || null,
        nim: user.profile?.nim || null,
        nip: user.profile?.nip || null,
        // Role data
        role: user.role?.name || null,
        roleId: user.role?.id || null,
        // Study program data
        studyProgram: user.profile?.study_program?.name || null,
        studyProgramCode: user.profile?.study_program?.code || null,
        studyProgramLevel: user.profile?.study_program?.level || null,
        // Faculty data
        faculty: user.profile?.study_program?.faculty?.name || null,
        facultyCode: user.profile?.study_program?.faculty?.code || null,
        facultyAbbreviation:
          user.profile?.study_program?.faculty?.abbreviation || null,
        // Timestamps
        lastUpdatePassword: user.last_update_password,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    };
  }

  //  Update profile - Based on your schema structure
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { fullName, email, nim, nip, studyProgramId } = updateProfileDto;

    if (!userId || userId.trim() === '') {
      throw new BadRequestException('ID pengguna diperlukan');
    }

    // Check if at least one field is provided
    if (!fullName && !email && !nim && !nip && !studyProgramId) {
      throw new BadRequestException(
        'Setidaknya satu field harus disediakan untuk pembaruan',
      );
    }

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        profile: {
          select: {
            email: true,
            nim: true,
            nip: true,
          },
        },
      },
    });

    if (!existingUser) {
      throw new NotFoundException('Pengguna tidak ditemukan');
    }

    //  Check email uniqueness (if email is being updated)
    if (email && email !== existingUser.profile?.email) {
      const emailExists = await this.prisma.userProfile.findFirst({
        where: {
          email,
          NOT: { user_id: userId },
        },
      });

      if (emailExists) {
        throw new ConflictException('Email sudah digunakan oleh pengguna lain');
      }
    }

    //  Check NIM uniqueness (if NIM is being updated)
    if (nim && nim !== existingUser.profile?.nim) {
      const nimExists = await this.prisma.userProfile.findFirst({
        where: {
          nim,
          NOT: { user_id: userId },
        },
      });

      if (nimExists) {
        throw new ConflictException('NIM sudah digunakan oleh pengguna lain');
      }
    }

    //  Check NIP uniqueness (if NIP is being updated)
    if (nip && nip !== existingUser.profile?.nip) {
      const nipExists = await this.prisma.userProfile.findFirst({
        where: {
          nip,
          NOT: { user_id: userId },
        },
      });

      if (nipExists) {
        throw new ConflictException('NIP sudah digunakan oleh pengguna lain');
      }
    }

    //  Validate study program exists (if provided)
    if (studyProgramId) {
      const studyProgramExists = await this.prisma.studyProgram.findUnique({
        where: { id: studyProgramId },
      });

      if (!studyProgramExists) {
        throw new BadRequestException('Program studi tidak ditemukan');
      }
    }

    // Build update data
    const updateData: any = {};
    if (fullName !== undefined) updateData.full_name = fullName;
    if (email !== undefined) updateData.email = email;
    if (nim !== undefined) updateData.nim = nim;
    if (nip !== undefined) updateData.nip = nip;
    if (studyProgramId !== undefined)
      updateData.study_program_id = studyProgramId;

    //  Update or create user profile
    const updatedProfile = await this.prisma.userProfile.upsert({
      where: { user_id: userId },
      update: updateData,
      create: {
        user_id: userId,
        email: email || '',
        full_name: fullName || '',
        ...updateData,
      },
      select: {
        email: true,
        full_name: true,
        nim: true,
        nip: true,
        study_program: {
          select: {
            id: true,
            name: true,
            code: true,
            level: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            updated_at: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: 'Profil berhasil diperbarui',
      data: {
        id: updatedProfile.user.id,
        username: updatedProfile.user.username,
        email: updatedProfile.email,
        fullName: updatedProfile.full_name,
        nim: updatedProfile.nim,
        nip: updatedProfile.nip,
        role: updatedProfile.user.role?.name || null,
        studyProgram: updatedProfile.study_program?.name || null,
        updatedAt: updatedProfile.user.updated_at,
      },
    };
  }

  //  Change password - Based on your schema
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    if (!userId || userId.trim() === '') {
      throw new BadRequestException('ID pengguna diperlukan');
    }

    // Password confirmation validation
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'Kata sandi baru dan konfirmasi tidak cocok',
      );
    }

    // Get user with password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan');
    }

    // Verify current password
    try {
      const passwordValid = await argon2.verify(user.password, currentPassword);
      if (!passwordValid) {
        throw new UnauthorizedException('Kata sandi saat ini salah');
      }
    } catch (error) {
      throw new UnauthorizedException('Kata sandi saat ini salah');
    }

    // Check if new password is different from current
    try {
      const isSamePassword = await argon2.verify(user.password, newPassword);
      if (isSamePassword) {
        throw new BadRequestException(
          'Kata sandi baru harus berbeda dari kata sandi saat ini',
        );
      }
    } catch (error) {
      // If argon2.verify fails, passwords are different (good)
    }

    // Hash new password
    const hashedNewPassword = await argon2.hash(newPassword);

    //  Update password and last_update_password timestamp
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        last_update_password: new Date(),
      },
    });

    return {
      success: true,
      message: 'Kata sandi berhasil diubah',
    };
  }
}
