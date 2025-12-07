import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SeederService } from './seeder/seeder.service';
import { SeederModule } from './seeder/seeder.module';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
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
    await appContext.close();
  }
}

bootstrap();
