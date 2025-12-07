import { Module } from '@nestjs/common';
import { KategoriController } from './kategori.controller';
import { KategoriService } from './kategori.service';

@Module({
  controllers: [KategoriController],
  providers: [KategoriService]
})
export class KategoriModule {}
