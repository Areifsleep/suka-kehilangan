import { Module } from '@nestjs/common';

import { SeederService } from './seeder.service';
import { PrismaModule } from '../prisma/prisma.module';
import {
  RoleSeeder,
  FacultySeeder,
  StudyProgramSeeder,
  ReportCategorySeeder,
  AdminUserSeeder,
  PetugasUserSeeder,
  DosenUserSeeder,
  MahasiswaUserSeeder,
  BarangTemuanSeeder,
} from './seeders';

@Module({
  imports: [PrismaModule],
  providers: [
    SeederService,
    RoleSeeder,
    FacultySeeder,
    StudyProgramSeeder,
    ReportCategorySeeder,
    AdminUserSeeder,
    PetugasUserSeeder,
    DosenUserSeeder,
    MahasiswaUserSeeder,
    BarangTemuanSeeder,
  ],
  exports: [SeederService],
})
export class SeederModule {}
