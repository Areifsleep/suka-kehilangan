import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import { BaseSeeder } from './base.seeder';
import { PrismaService } from '../../prisma/prisma.service';
import { GENERIC_PASSWORD } from '../data';

@Injectable()
export class AdminUserSeeder extends BaseSeeder {
  constructor(prismaService: PrismaService) {
    super(prismaService, AdminUserSeeder.name);
  }

  async run(): Promise<void> {
    this.logger.log('Seeding data user admin...');

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
}
