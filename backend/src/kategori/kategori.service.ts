import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KategoriService {
  constructor(private prismaService: PrismaService) {}
  async getAll() {
    return await this.prismaService.kategoriBarang.findMany({
      select: {
        id: true,
        nama: true,
        deskripsi: true,
      },
      orderBy: {
        nama: 'asc',
      },
    });
  }
}
