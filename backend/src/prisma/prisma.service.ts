import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Panggil constructor dari parent class (PrismaClient)
    // dengan opsi konfigurasi untuk logging.
    super({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
      ],
    });
  }

  async onModuleInit() {
    // Method ini akan dipanggil setelah semua dependensi modul ter-resolve.
    // Kita menghubungkan Prisma Client ke database di sini.
    await this.$connect();
  }
}
