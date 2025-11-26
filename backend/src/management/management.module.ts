// backend/src/management/management.module.ts
import { Module } from '@nestjs/common';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PdfGeneratorService } from '../common/services/pdf-generator.service';

@Module({
  imports: [PrismaModule],
  controllers: [ManagementController],
  providers: [ManagementService, PdfGeneratorService],
  exports: [ManagementService],
})
export class ManagementModule {}
