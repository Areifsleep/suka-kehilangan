import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module'; // Import AppModule utama Anda
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  // Buat application context, bukan server HTTP penuh
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const logger = new Logger('Seeder');

  if (process.env.NODE_ENV === 'production') {
    logger.warn(
      'Seeding tidak diizinkan di lingkungan produksi. Proses dihentikan.',
    );
    return;
  }

  // Ambil instance SeederService dari context
  const seeder = appContext.get(SeederService);

  logger.log('Memulai seeding dari skrip...');

  try {
    await seeder.seed();
    logger.log('Seeding berhasil diselesaikan.');
  } catch (error) {
    logger.error('Seeding gagal!', error.stack);
  } finally {
    // Tutup koneksi setelah selesai
    await appContext.close();
  }
}

bootstrap();
