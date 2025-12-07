import { Injectable, Logger } from '@nestjs/common';
import {
  RoleSeeder,
  FacultySeeder,
  StudyProgramSeeder,
  ReportCategorySeeder,
  AdminUserSeeder,
  PetugasUserSeeder,
  DosenUserSeeder,
  MahasiswaUserSeeder,
} from './seeders';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly roleSeeder: RoleSeeder,
    private readonly facultySeeder: FacultySeeder,
    private readonly studyProgramSeeder: StudyProgramSeeder,
    private readonly reportCategorySeeder: ReportCategorySeeder,
    private readonly adminUserSeeder: AdminUserSeeder,
    private readonly petugasUserSeeder: PetugasUserSeeder,
    private readonly dosenUserSeeder: DosenUserSeeder,
    private readonly mahasiswaUserSeeder: MahasiswaUserSeeder,
  ) {}

  /**
   * Fungsi utama untuk menjalankan semua proses seeding.
   * Seeder dijalankan sesuai urutan dependency.
   */
  async seed() {
    this.logger.log('Memulai proses seeding...');

    // Jalankan seeder yang tidak memiliki dependency secara paralel
    await Promise.all([
      this.facultySeeder.run(),
      this.reportCategorySeeder.run(),
      this.roleSeeder.run(),
    ]);

    // Jalankan seeder yang bergantung pada faculty
    await this.studyProgramSeeder.run();

    // Jalankan seeder user yang bergantung pada role dan study program
    await this.adminUserSeeder.run();
    await this.petugasUserSeeder.run();
    await this.dosenUserSeeder.run();
    await this.mahasiswaUserSeeder.run();

    this.logger.log('Proses seeding selesai.');
  }

  /**
   * Method untuk menjalankan seeder spesifik.
   * Berguna untuk development atau testing.
   */
  async seedSpecific(seederName: string) {
    this.logger.log(`Menjalankan seeder: ${seederName}`);

    const seeders = {
      role: this.roleSeeder,
      faculty: this.facultySeeder,
      studyProgram: this.studyProgramSeeder,
      reportCategory: this.reportCategorySeeder,
      adminUser: this.adminUserSeeder,
      petugasUser: this.petugasUserSeeder,
      dosenUser: this.dosenUserSeeder,
      mahasiswaUser: this.mahasiswaUserSeeder,
    };

    const seeder = seeders[seederName];

    if (!seeder) {
      throw new Error(`Seeder "${seederName}" tidak ditemukan.`);
    }

    await seeder.run();
    this.logger.log(`Seeder "${seederName}" selesai dijalankan.`);
  }
}
