import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import argon2 from 'argon2';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Fungsi utama untuk menjalankan semua proses seeding.
   */
  async seed() {
    this.logger.log('Memulai proses seeding...');

    // Panggil fungsi-fungsi seeder secara berurutan
    // await this.seedRole();
    await this.seedAdminUser();
    // await this.seedProducts(); // Contoh jika ada seeder lain
    // await this.seedCategories(); // Contoh jika ada seeder lain

    this.logger.log('Proses seeding selesai.');
  }

  /**
   * Seeder untuk data User.
   * Selalu hash password sebelum menyimpannya.
   */
  private async seedRole() {
    this.logger.log('Seeding data role...');

    const rolesToCreate = ['ADMIN', 'USER', 'OFFICER'];

    const data = rolesToCreate.map((r) => ({
      role_name: r,
    }));

    try {
      await this.prismaService.role.createMany({
        data,
      });

      this.logger.log('Data role berhasil di-seed.');
    } catch (error) {
      this.logger.error('Gagal melakukan seeding data role.', error);
    }
  }

  private async seedAdminUser() {
    this.logger.log('Seeding data admin...');
    const adminData = {
      username: 'admin',
      password: 'admin123', // Pastikan untuk meng-hash password ini sebelum menyimpan
      role: 'ADMIN',
      email: 'admin@gmail.com',
    };

    try {
      const hasedPassword = await argon2.hash(adminData.password);

      const adminRoleId = await this.prismaService.role.findFirst({
        where: { role_name: adminData.role },
        select: { id_role: true },
      });

      if (!adminRoleId) {
        throw new Error(
          'Role ADMIN tidak ditemukan. Pastikan role sudah di-seed terlebih dahulu.',
        );
      }

      await this.prismaService.user.create({
        data: {
          username: adminData.username,
          password: hasedPassword,
          email: adminData.email,
          id_role: adminRoleId.id_role,
          name: 'Admin',
        },
      });
    } catch (error) {
      this.logger.error('Gagal melakukan seeding data admin.', error);
    }
  }

  private async seedUsers() {}

  // Tambahkan fungsi seeder lain di sini...
  // private async seedProducts() { ... }
}
