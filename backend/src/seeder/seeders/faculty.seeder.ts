import { Injectable } from '@nestjs/common';
import { BaseSeeder } from './base.seeder';
import { PrismaService } from '../../prisma/prisma.service';
import dataFakultas from '../../../process_data/fakultas.json';

@Injectable()
export class FacultySeeder extends BaseSeeder {
  constructor(prismaService: PrismaService) {
    super(prismaService, FacultySeeder.name);
  }

  async run(): Promise<void> {
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
}
