# Seeder Module

Modul seeder untuk mengelola data awal aplikasi. Struktur ini terinspirasi dari Laravel Seeder untuk meningkatkan maintainability dan modularitas.

## Struktur

```
seeder/
├── seeders/               # Individual seeder classes
│   ├── base.seeder.ts    # Base class untuk semua seeder
│   ├── role.seeder.ts
│   ├── faculty.seeder.ts
│   ├── study-program.seeder.ts
│   ├── report-category.seeder.ts
│   ├── admin-user.seeder.ts
│   ├── petugas-user.seeder.ts
│   ├── dosen-user.seeder.ts
│   ├── mahasiswa-user.seeder.ts
│   └── index.ts
├── data/                  # Data constants dan konfigurasi
├── seeder.service.ts     # Service utama (seperti DatabaseSeeder di Laravel)
└── seeder.module.ts      # Module definition
```

## Cara Penggunaan

### Menjalankan Semua Seeder

Seeder akan dijalankan secara otomatis saat aplikasi pertama kali dijalankan atau dapat dijalankan manual melalui:

```typescript
// Di seed.ts atau melalui CLI
await seederService.seed();
```

### Menjalankan Seeder Spesifik

Untuk menjalankan seeder tertentu (berguna untuk development/testing):

```typescript
await seederService.seedSpecific('role'); // Hanya role
await seederService.seedSpecific('faculty'); // Hanya fakultas
await seederService.seedSpecific('studyProgram'); // Hanya program studi
await seederService.seedSpecific('reportCategory'); // Hanya kategori laporan
await seederService.seedSpecific('adminUser'); // Hanya admin
await seederService.seedSpecific('petugasUser'); // Hanya petugas
await seederService.seedSpecific('dosenUser'); // Hanya dosen
await seederService.seedSpecific('mahasiswaUser'); // Hanya mahasiswa
```

## Membuat Seeder Baru

1. Buat file baru di `seeders/` directory:

```typescript
// seeders/new-entity.seeder.ts
import { Injectable } from '@nestjs/common';
import { BaseSeeder } from './base.seeder';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NewEntitySeeder extends BaseSeeder {
  constructor(prismaService: PrismaService) {
    super(prismaService, NewEntitySeeder.name);
  }

  async run(): Promise<void> {
    this.logger.log('Seeding data new entity...');

    try {
      // Implementasi seeding di sini
      await this.prismaService.newEntity.createMany({
        data: [...],
        skipDuplicates: true,
      });

      this.logger.log('Data new entity berhasil di-seed.');
    } catch (error) {
      this.logger.error('Gagal melakukan seeding data new entity.', error.stack);
      throw error;
    }
  }
}
```

2. Tambahkan ke `seeders/index.ts`:

```typescript
export * from './new-entity.seeder';
```

3. Register di `seeder.module.ts`:

```typescript
import { NewEntitySeeder } from './seeders';

@Module({
  providers: [
    // ... existing seeders
    NewEntitySeeder,
  ],
})
```

4. Tambahkan ke `seeder.service.ts`:

```typescript
constructor(
  // ... existing seeders
  private readonly newEntitySeeder: NewEntitySeeder,
) {}

async seed() {
  // Tambahkan sesuai urutan dependency
  await this.newEntitySeeder.run();
}
```

## Urutan Eksekusi

Seeder dijalankan dengan urutan berikut untuk menghormati dependency:

1. **Parallel** (tidak ada dependency):
   - Role
   - Faculty
   - Report Category

2. **Sequential** (bergantung pada Faculty):
   - Study Program

3. **Parallel** (bergantung pada Role):
   - Admin User
   - Petugas User

4. **Sequential** (data besar, bergantung pada Role & Study Program):
   - Dosen User
   - Mahasiswa User

## Best Practices

1. **Idempotency**: Gunakan `skipDuplicates: true` untuk mencegah error saat seeder dijalankan ulang
2. **Logging**: Gunakan `this.logger` untuk mencatat progress dan error
3. **Error Handling**: Wrap logic dalam try-catch dan throw error untuk menghentikan proses jika ada masalah kritis
4. **Batch Operations**: Gunakan `createMany()` atau `Promise.all()` untuk operasi batch yang efisien
5. **Validation**: Cek dependency (role, faculty, dll) sebelum membuat data
6. **Single Responsibility**: Setiap seeder hanya bertanggung jawab untuk satu entity atau tipe data

## Keuntungan Struktur Ini

✅ **Maintainable**: Setiap seeder terpisah dan mudah ditemukan  
✅ **Testable**: Dapat di-test secara individual  
✅ **Reusable**: Seeder dapat dijalankan ulang dengan aman  
✅ **Modular**: Mudah menambah/menghapus seeder baru  
✅ **Clear Dependencies**: Urutan eksekusi jelas dan terdokumentasi  
✅ **Laravel-like**: Familiar bagi developer yang pernah menggunakan Laravel
