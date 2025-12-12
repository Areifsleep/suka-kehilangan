import { Module } from '@nestjs/common';
import { BarangTemuanController } from './barang-temuan.controller';
import { BarangTemuanService } from './barang-temuan.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [BarangTemuanController],
  providers: [BarangTemuanService],
  exports: [BarangTemuanService],
})
export class BarangTemuanModule {}
