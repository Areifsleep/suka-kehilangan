import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { LokasiPos } from '@prisma/client';
import { BaseSeeder } from './base.seeder';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PetugasUserSeeder extends BaseSeeder {
  constructor(prismaService: PrismaService) {
    super(prismaService, PetugasUserSeeder.name);
  }

  async run(): Promise<void> {
    this.logger.log('Seeding data user petugas...');

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

      this.logger.log('Data user petugas berhasil di-seed.');
    } catch (error) {
      this.logger.error('Gagal melakukan seeding user petugas.', error.stack);
    }
  }
}
