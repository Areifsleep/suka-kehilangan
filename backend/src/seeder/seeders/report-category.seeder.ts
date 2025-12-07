import { Injectable } from '@nestjs/common';
import { BaseSeeder } from './base.seeder';
import { PrismaService } from '../../prisma/prisma.service';
import { REPORT_CATEGORIES_DATA } from '../data';

@Injectable()
export class ReportCategorySeeder extends BaseSeeder {
  constructor(prismaService: PrismaService) {
    super(prismaService, ReportCategorySeeder.name);
  }

  async run(): Promise<void> {
    this.logger.log('Seeding data kategori laporan...');

    try {
      await this.prismaService.kategoriBarang.createMany({
        data: REPORT_CATEGORIES_DATA.map((category) => ({
          nama: category.name,
          deskripsi: category.description,
        })),
        skipDuplicates: true,
      });

      this.logger.log('Data kategori laporan berhasil di-seed.');
    } catch (error) {
      this.logger.error(
        'Gagal melakukan seeding data kategori laporan.',
        error.stack,
      );
    }
  }
}
