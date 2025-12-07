import { Injectable } from '@nestjs/common';
import { BaseSeeder } from './base.seeder';
import { PrismaService } from '../../prisma/prisma.service';
import dataProgramStudi from '../../../process_data/program_studi.json';

@Injectable()
export class StudyProgramSeeder extends BaseSeeder {
  constructor(prismaService: PrismaService) {
    super(prismaService, StudyProgramSeeder.name);
  }

  async run(): Promise<void> {
    this.logger.log('Seeding data program studi...');

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

      this.logger.log('Data program studi berhasil di-seed.');
    } catch (error) {
      this.logger.error(
        'Gagal melakukan seeding data program studi.',
        error.stack,
      );
    }
  }
}
