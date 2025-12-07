import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { BaseSeeder } from './base.seeder';
import { PrismaService } from '../../prisma/prisma.service';
import { GENERIC_PASSWORD } from '../data';
import studentsData from '../../../process_data/angkatan-2023.json';

@Injectable()
export class MahasiswaUserSeeder extends BaseSeeder {
  constructor(prismaService: PrismaService) {
    super(prismaService, MahasiswaUserSeeder.name);
  }

  async run(): Promise<void> {
    this.logger.log('Seeding data user mahasiswa...');

    try {
      // 1. Ambil semua data prasyarat untuk efisiensi
      const studentRole = await this.prismaService.role.findFirst({
        where: { name: 'USER' },
      });

      if (!studentRole) {
        this.logger.warn(
          'Role "USER" tidak ditemukan. Seeding mahasiswa dilewati.',
        );
        return;
      }

      // Buat map program studi untuk pencarian cepat
      const studyPrograms = await this.prismaService.studyProgram.findMany({
        select: { id: true, code: true },
      });
      const studyProgramMap = new Map(studyPrograms.map((p) => [p.code, p.id]));

      // Ambil semua username yang ada untuk mencegah duplikat
      const existingUsers = await this.prismaService.user.findMany({
        select: { username: true },
      });
      const existingUsernames = new Set(existingUsers.map((u) => u.username));

      // 3. Filter data mahasiswa yang akan dibuat
      const studentsToCreate = studentsData.filter((student) => {
        const username = student.NIM.toString();
        const prodiCode = student.KODE_PRODI.toString();

        if (existingUsernames.has(username)) {
          return false; // Lewati jika NIM sudah terdaftar
        }

        if (!studyProgramMap.has(prodiCode)) {
          this.logger.warn(
            `Program Studi dengan kode "${prodiCode}" tidak ditemukan untuk mahasiswa "${student.NAMA}". Data dilewati.`,
          );
          return false; // Lewati jika prodi tidak valid
        }
        return true;
      });

      if (studentsToCreate.length === 0) {
        this.logger.log('Tidak ada data mahasiswa baru untuk di-seed.');
        return;
      }

      // 4. Hash password sekali untuk semua user baru
      const hashedPassword = await argon2.hash(GENERIC_PASSWORD);

      // 5. Buat semua user mahasiswa dalam satu batch promise
      const createPromises = studentsToCreate.map((student) => {
        const username = student.NIM.toString();
        const prodiCode = student.KODE_PRODI.toString();
        const studyProgramId = studyProgramMap.get(prodiCode);

        return this.prismaService.user.create({
          data: {
            username: username,
            password: hashedPassword,
            role_id: studentRole.id,
            profile: {
              create: {
                full_name: student.FORMATED_NAMA,
                email: `${username}@student.uin-suka.ac.id`,
                nim: username,
                study_program_id: studyProgramId,
              },
            },
          },
        });
      });

      await Promise.all(createPromises);

      this.logger.log(
        `Berhasil membuat ${studentsToCreate.length} user mahasiswa baru.`,
      );
    } catch (error) {
      this.logger.error('Gagal melakukan seeding user mahasiswa.', error.stack);
    }
  }
}
