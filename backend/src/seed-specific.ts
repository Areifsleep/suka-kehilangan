import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './seeder/seeder.service';

/**
 * Script untuk menjalankan seeder spesifik dari command line.
 *
 * Penggunaan:
 * yarn seed:specific role
 * yarn seed:specific faculty
 * yarn seed:specific adminUser
 * dll.
 */
async function runSpecificSeeder() {
  const seederName = process.argv[2];

  if (!seederName) {
    console.error('❌ Error: Nama seeder harus disediakan!');
    console.log('\nPenggunaan: yarn seed:specific <seederName>');
    console.log('\nSeeder yang tersedia:');
    console.log('  - role');
    console.log('  - faculty');
    console.log('  - studyProgram');
    console.log('  - reportCategory');
    console.log('  - adminUser');
    console.log('  - petugasUser');
    console.log('  - dosenUser');
    console.log('  - mahasiswaUser');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  try {
    console.log(`\n🌱 Menjalankan seeder: ${seederName}\n`);
    await seederService.seedSpecific(seederName);
    console.log(`\n✅ Seeder "${seederName}" berhasil dijalankan!\n`);
  } catch (error) {
    console.error(
      `\n❌ Error saat menjalankan seeder "${seederName}":`,
      error.message,
    );
    process.exit(1);
  } finally {
    await app.close();
  }
}

runSpecificSeeder();
