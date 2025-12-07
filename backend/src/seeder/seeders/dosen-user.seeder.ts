import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { BaseSeeder } from './base.seeder';
import { PrismaService } from '../../prisma/prisma.service';
import { GENERIC_PASSWORD } from '../data';
import lecturersData from '../../../process_data/gabungan_dosen.json';

@Injectable()
export class DosenUserSeeder extends BaseSeeder {
  constructor(prismaService: PrismaService) {
    super(prismaService, DosenUserSeeder.name);
  }

  async run(): Promise<void> {
    this.logger.log('Seeding data user dosen...');

    try {
      // 1. Ambil semua data prasyarat terlebih dahulu untuk efisiensi
      const lecturerRole = await this.prismaService.role.findFirst({
        where: { name: 'USER' },
      });

      if (!lecturerRole) {
        this.logger.warn(
          'Role "USER" tidak ditemukan. Seeding dosen dilewati.',
        );
        return;
      }

      // Ambil semua program studi untuk dibuatkan map pencarian
      const studyPrograms = await this.prismaService.studyProgram.findMany({
        select: { id: true, code: true },
      });
      const studyProgramMap = new Map(studyPrograms.map((p) => [p.code, p.id]));

      // Ambil semua username yang sudah ada untuk mencegah duplikat
      const existingUsers = await this.prismaService.user.findMany({
        select: { username: true },
      });
      const existingUsernames = new Set(existingUsers.map((u) => u.username));

      // 3. Filter data dosen yang belum ada di database
      const lecturersToCreate = lecturersData.filter((lecturer) => {
        // Cek apakah NIP sudah terdaftar sebagai username
        if (existingUsernames.has(lecturer.nip)) {
          return false; // Lewati jika sudah ada
        }
        // Cek apakah program studinya valid
        if (!studyProgramMap.has(lecturer.kode_prodi)) {
          this.logger.warn(
            `Program Studi dengan kode "${lecturer.kode_prodi}" tidak ditemukan untuk dosen "${lecturer.nama_dosen}". Data dilewati.`,
          );
          return false; // Lewati jika prodi tidak ditemukan
        }
        return true;
      });

      if (lecturersToCreate.length === 0) {
        this.logger.log('Tidak ada data dosen baru untuk di-seed.');
        return;
      }

      // 4. Hash password sekali saja
      const hashedPassword = await argon2.hash(GENERIC_PASSWORD);

      // 5. Buat semua user dosen yang baru dalam satu batch promise
      const createPromises = lecturersToCreate.map((lecturer) => {
        const studyProgramId = studyProgramMap.get(lecturer.kode_prodi);

        return this.prismaService.user.create({
          data: {
            username: lecturer.nip,
            password: hashedPassword,
            role_id: lecturerRole.id,
            profile: {
              create: {
                full_name: lecturer.nama_dosen,
                email: `${lecturer.nip}@uin-suka.ac.id`,
                nip: lecturer.nip,
                study_program_id: studyProgramId,
              },
            },
          },
        });
      });

      await Promise.all(createPromises);

      this.logger.log(
        `Berhasil membuat ${lecturersToCreate.length} user dosen baru.`,
      );
    } catch (error) {
      this.logger.error('Gagal melakukan seeding user dosen.', error.stack);
    }
  }
}
