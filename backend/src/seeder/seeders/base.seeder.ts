import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Base class untuk semua seeder.
 * Mirip dengan konsep Seeder di Laravel.
 */
export abstract class BaseSeeder {
  protected readonly logger: Logger;

  constructor(
    protected readonly prismaService: PrismaService,
    loggerContext: string,
  ) {
    this.logger = new Logger(loggerContext);
  }

  /**
   * Method yang harus diimplementasikan oleh setiap seeder.
   */
  abstract run(): Promise<void>;
}
