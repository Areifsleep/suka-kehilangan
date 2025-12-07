import { Controller, Get } from '@nestjs/common';
import { KategoriService } from './kategori.service';

@Controller('categories')
export class KategoriController {
  constructor(private readonly kategoriService: KategoriService) {}
  @Get('/')
  async getCategories() {
    return this.kategoriService.getAll();
  }
}
