import * as argon2 from 'argon2';
import { Injectable, Logger } from '@nestjs/common';
import { LokasiPos } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import dataFakultas from '../../process_data/fakultas.json';
import studentsData from '../../process_data/angkatan-2023.json';
import lecturersData from '../../process_data/gabungan_dosen.json';
import dataProgramStudi from '../../process_data/program_studi.json';
import {
  GENERIC_PASSWORD,
  ROLES_DATA,
  ROLE_NAME_MAPPING,
  REPORT_CATEGORIES_DATA,
} from 'src/constants/config-seed';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Fungsi utama untuk menjalankan semua proses seeding.
   */
  async seed() {
    this.logger.log('Memulai proses seeding...');
    await Promise.all([
      this.seedFaculties(),
      this.seedReportCatgories(),
      this.seedRole(),
    ]);

    await this.seedStudyPrograms();
    await this.seedUserAdmin();
    await this.seedUserPetugas();
    await this.seedUserDosen();
    await this.seedUserMahasiswa();
    await this.seedReports();

    this.logger.log('Proses seeding selesai.');
  }

  private async seedRole() {
    this.logger.log('Seeding data role...');
    // Nama role harus konsisten dengan yang ada di kode dan database
    const data = ROLES_DATA.map((name) => ({ name }));

    try {
      await this.prismaService.role.createMany({
        data,
        skipDuplicates: true, // Lewati jika data sudah ada
      });
      this.logger.log('Data role berhasil di-seed.');
    } catch (error) {
      this.logger.error('Gagal melakukan seeding data role.', error.stack);
    }
  }

  private async seedFaculties() {
    await this.prismaService.faculty.createMany({
      data: dataFakultas.map((fakultas) => ({
        id: fakultas.id_fakultas,
        name: fakultas.nama,
        code: fakultas.kode_fakultas,
        abbreviation: fakultas.singkatan,
      })),
      skipDuplicates: true,
    });
  }

  private async seedStudyPrograms() {
    this.logger.log('Memulai seeding data untuk program studi...');

    try {
      await this.prismaService.studyProgram.createMany({
        data: dataProgramStudi.map((prodi) => ({
          id: prodi.id_prodi,
          faculty_id: prodi.id_fakultas,
          name: prodi.nama,
          code: prodi.kode_prodi,
          level:
            prodi.jenjang_studi === 'S1'
              ? 'S1'
              : prodi.jenjang_studi === 'S2'
                ? 'S2'
                : 'S3',
        })),
        skipDuplicates: true,
      });

      this.logger.log('Berhasil melakukan seeding data program studi.');
    } catch (error) {
      this.logger.error(
        'Gagal melakukan seeding data program studi.',
        error.stack,
      );
    }
  }

  private async seedReportCatgories() {
    this.logger.log('Seeding data for report categories...');

    try {
      // Use createMany for efficiency and skipDuplicates to avoid errors on re-runs.
      // This checks for unique constraints (like the 'name' field) and skips any duplicates.
      await this.prismaService.reportCategory.createMany({
        data: REPORT_CATEGORIES_DATA,
        skipDuplicates: true,
      });

      this.logger.log('Berhasil melakukan seeding data kategori laporan.');
    } catch (error) {
      this.logger.error(
        'Gagal melakukan seeding data kategori laporan.',
        error.stack,
      );
    }
  }

  private async seedUserDosen() {
    this.logger.log('Seeding data untuk user: Dosen...');
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

  private async seedUserMahasiswa() {
    this.logger.log('Seeding data untuk user: Mahasiswa...');
    try {
      // 1. Ambil semua data prasyarat untuk efisiensi
      const studentRole = await this.prismaService.role.findFirst({
        where: { name: 'USER' }, // Menggunakan role yang sesuai untuk mahasiswa
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

  private async seedUserPetugas() {
    this.logger.log('Seeding data untuk user: Petugas...');
    try {
      const officerRole = await this.prismaService.role.findFirst({
        where: { name: 'PETUGAS' },
      });

      if (!officerRole) {
        this.logger.warn(
          'Role "PETUGAS" tidak ditemukan. Seeding petugas dilewati.',
        );
        return;
      }

      // Check if any petugas already exists
      const existingOfficer = await this.prismaService.user.findFirst({
        where: {
          username: {
            startsWith: 'petugas',
          },
        },
      });

      if (existingOfficer) {
        this.logger.log('User petugas sudah ada, seeding dilewati.');
        return;
      }

      const hashedPassword = await argon2.hash('12345678');
      const lokasiOptions: LokasiPos[] = [
        LokasiPos.POS_BARAT,
        LokasiPos.POS_TIMUR,
      ];

      // Create 21 petugas users
      for (let i = 1; i <= 21; i++) {
        const username = `petugas${i.toString().padStart(2, '0')}`;
        const lokasiPos =
          lokasiOptions[Math.floor(Math.random() * lokasiOptions.length)];

        await this.prismaService.user.create({
          data: {
            username,
            password: hashedPassword,
            role_id: officerRole.id,
            profile: {
              create: {
                full_name: `Petugas ${i.toString().padStart(2, '0')}`,
                email: `${username}@uin-suka.ac.id`,
                lokasi_pos: lokasiPos,
              },
            },
          },
        });

        this.logger.log(
          `Berhasil membuat user "${username}" dengan lokasi pos ${lokasiPos}.`,
        );
      }
    } catch (error) {
      this.logger.error('Gagal melakukan seeding user petugas.', error.stack);
    }
  }

  private async seedUserAdmin() {
    this.logger.log('Seeding data untuk user: Admin...');
    try {
      const adminRole = await this.prismaService.role.findFirst({
        where: { name: 'ADMIN' },
      });

      if (!adminRole) {
        this.logger.warn(
          'Role "ADMIN" tidak ditemukan. Seeding admin dilewati.',
        );
        return;
      }

      const adminExists = await this.prismaService.user.findUnique({
        where: { username: 'admin' },
      });

      if (adminExists) {
        this.logger.log('User "admin" sudah ada, seeding dilewati.');
        return;
      }

      const hashedPassword = await argon2.hash(GENERIC_PASSWORD);

      await this.prismaService.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          role_id: adminRole.id,
          profile: {
            create: {
              full_name: 'Administrator',
              email: 'admin@uin-suka.ac.id',
            },
          },
        },
      });
      this.logger.log('Berhasil membuat user "admin".');
    } catch (error) {
      this.logger.log('Gagal melakukan seeding user admin.', error.stack);
    }
  }

  private async seedReports() {
    this.logger.log('Seeding data untuk reports dummy...');
    try {
      // Check if reports already exist
      const existingReports = await this.prismaService.report.count();
      if (existingReports > 0) {
        this.logger.log('Reports sudah ada, seeding dilewati.');
        return;
      }

      // Get necessary data
      const categories = await this.prismaService.reportCategory.findMany();
      const petugasUsers = await this.prismaService.user.findMany({
        where: {
          role: {
            name: 'PETUGAS',
          },
        },
        take: 5,
      });
      const regularUsers = await this.prismaService.user.findMany({
        where: {
          role: {
            name: 'USER',
          },
        },
        take: 10,
      });

      if (
        categories.length === 0 ||
        petugasUsers.length === 0 ||
        regularUsers.length === 0
      ) {
        this.logger.warn(
          'Data prasyarat (categories, users) tidak lengkap. Seeding reports dilewati.',
        );
        return;
      }

      const reportTypes: ('FOUND' | 'LOST')[] = ['FOUND', 'LOST'];
      const reportStatuses: ('OPEN' | 'CLAIMED' | 'CLOSED')[] = [
        'OPEN',
        'CLAIMED',
        'CLOSED',
      ];
      const itemNames = [
        'Handphone Samsung',
        'Laptop Asus',
        'Tas Ransel Hitam',
        'Dompet Coklat',
        'Kunci Motor',
        'Buku Catatan',
        'Kacamata',
        'Jam Tangan',
        'Power Bank',
        'Earphone',
        'Jaket Biru',
        'Sepatu Sneakers',
        'Payung Hitam',
        'Botol Minum',
        'Charger Laptop',
        'Mouse Wireless',
        'Flash Disk',
        'Kabel USB',
        'Helmet',
        'ID Card',
      ];
      const locations = [
        'Masjid UIN',
        'Perpustakaan Lantai 2',
        'Gedung Kuliah A',
        'Gedung Kuliah B',
        'Kantin Utama',
        'Parkiran Barat',
        'Parkiran Timur',
        'Lab Komputer',
        'Ruang Kelas 101',
        'Ruang Kelas 205',
        'Lapangan Olahraga',
        'Auditorium',
        'Pos Satpam Barat',
        'Pos Satpam Timur',
      ];

      const reportsData: any[] = [];
      const now = new Date();

      // Create 30 reports with varied dates
      for (let i = 0; i < 30; i++) {
        const reportType =
          reportTypes[Math.floor(Math.random() * reportTypes.length)];
        const reportStatus =
          reportStatuses[Math.floor(Math.random() * reportStatuses.length)];
        const category =
          categories[Math.floor(Math.random() * categories.length)];
        const itemName =
          itemNames[Math.floor(Math.random() * itemNames.length)];
        const location =
          locations[Math.floor(Math.random() * locations.length)];

        // Random user (petugas for FOUND, regular for LOST)
        const createdBy =
          reportType === 'FOUND'
            ? petugasUsers[Math.floor(Math.random() * petugasUsers.length)]
            : regularUsers[Math.floor(Math.random() * regularUsers.length)];

        // Random claimed user (only for CLAIMED or CLOSED status)
        const claimedBy =
          reportStatus !== 'OPEN' && regularUsers.length > 0
            ? regularUsers[Math.floor(Math.random() * regularUsers.length)]
            : null;

        // Random date within last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const createdAt = new Date(now);
        createdAt.setDate(createdAt.getDate() - daysAgo);

        const claimedAt =
          reportStatus !== 'OPEN'
            ? new Date(
                createdAt.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000,
              )
            : null;

        reportsData.push({
          item_name: itemName,
          description: `${itemName} ditemukan/hilang di ${location}. ${reportType === 'FOUND' ? 'Barang dalam kondisi baik.' : 'Mohon bantuan untuk menemukannya.'}`,
          place_found: location,
          report_type: reportType,
          report_status: reportStatus,
          created_by_user_id: createdBy.id,
          claimed_by_user_id: claimedBy?.id || null,
          report_category_id: category.id,
          created_at: createdAt,
          updated_at: createdAt,
          claimed_at: claimedAt,
        });
      }

      // Insert all reports
      await this.prismaService.report.createMany({
        data: reportsData,
      });

      this.logger.log(`Berhasil membuat ${reportsData.length} reports dummy.`);
    } catch (error) {
      this.logger.error('Gagal melakukan seeding reports.', error.stack);
    }
  }
}
