import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { BarangTemuanController } from './barang-temuan.controller';
import { BarangTemuanService } from './barang-temuan.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    PrismaModule,
    StorageModule,
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
      },
    }),
  ],
  controllers: [BarangTemuanController],
  providers: [BarangTemuanService],
  exports: [BarangTemuanService],
})
export class BarangTemuanModule {}
