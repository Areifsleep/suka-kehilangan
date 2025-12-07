import { Injectable } from '@nestjs/common';
import { BaseSeeder } from './base.seeder';
import { PrismaService } from '../../prisma/prisma.service';
import { ROLES_DATA } from '../data';

@Injectable()
export class RoleSeeder extends BaseSeeder {
  constructor(prismaService: PrismaService) {
    super(prismaService, RoleSeeder.name);
  }

  async run(): Promise<void> {
    this.logger.log('Seeding data role...');
    const data = ROLES_DATA.map((name) => ({ name }));

    try {
      await this.prismaService.role.createMany({
        data,
        skipDuplicates: true,
      });
      this.logger.log('Data role berhasil di-seed.');
    } catch (error) {
      this.logger.error('Gagal melakukan seeding data role.', error.stack);
    }
  }
}
