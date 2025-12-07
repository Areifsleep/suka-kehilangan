# Migration Guide: Old Seeder → New Modular Seeder

## Perbandingan Struktur

### Struktur Lama (Monolithic)

```
seeder/
├── seeder.service.ts  (394 baris - semua logic dalam satu file)
├── seeder.module.ts
└── data/
```

### Struktur Baru (Modular)

```
seeder/
├── seeders/
│   ├── base.seeder.ts           (Base class)
│   ├── role.seeder.ts           (~30 baris)
│   ├── faculty.seeder.ts        (~30 baris)
│   ├── study-program.seeder.ts  (~40 baris)
│   ├── report-category.seeder.ts (~30 baris)
│   ├── admin-user.seeder.ts     (~50 baris)
│   ├── petugas-user.seeder.ts   (~70 baris)
│   ├── dosen-user.seeder.ts     (~90 baris)
│   ├── mahasiswa-user.seeder.ts (~90 baris)
│   └── index.ts
├── data/
├── seeder.service.ts            (~90 baris - orchestrator saja)
└── seeder.module.ts
```

## Keuntungan Struktur Baru

### 1. **Maintainability** ✅

**Sebelum**: Harus scroll 394 baris untuk menemukan dan mengedit seeder tertentu  
**Sesudah**: Langsung buka file seeder yang diperlukan (30-90 baris)

```typescript
// Sebelum: Cari method di file besar
private async seedUserDosen() { /* 100+ baris */ }

// Sesudah: File terpisah yang fokus
// dosen-user.seeder.ts
export class DosenUserSeeder extends BaseSeeder {
  async run() { /* logic di sini */ }
}
```

### 2. **Testability** ✅

**Sebelum**: Sulit test individual seeder karena semua private method  
**Sesudah**: Setiap seeder bisa di-test secara independent

```typescript
// Test individual seeder
describe('DosenUserSeeder', () => {
  it('should seed dosen successfully', async () => {
    await dosenSeeder.run();
    // assertions...
  });
});
```

### 3. **Reusability** ✅

**Sebelum**: Tidak bisa menjalankan seeder tertentu saja  
**Sesudah**: Dapat menjalankan seeder spesifik

```bash
# Hanya seed role
yarn seed:specific role

# Hanya seed admin
yarn seed:specific adminUser
```

### 4. **Separation of Concerns** ✅

**Sebelum**: `SeederService` bertanggung jawab untuk seeding DAN orchestration  
**Sesudah**:

- Individual seeders → seeding logic
- `SeederService` → orchestration saja

### 5. **Laravel-like Developer Experience** ✅

Developer yang familiar dengan Laravel akan langsung paham:

```php
// Laravel
php artisan db:seed --class=UserSeeder

// Nest.js (new structure)
yarn seed:specific adminUser
```

## Cara Migration

### Tidak Perlu Migration Data!

Struktur baru ini **backward compatible**. Data yang sudah di-seed tetap aman.

### Yang Berubah:

1. ❌ **Tidak ada breaking changes** pada data atau database
2. ✅ Code di-refactor menjadi lebih modular
3. ✅ API tetap sama: `seederService.seed()`
4. ➕ Fitur baru: `seederService.seedSpecific('name')`

## Perbandingan Code

### Sebelum (Monolithic)

```typescript
@Injectable()
export class SeederService {
  constructor(private readonly prismaService: PrismaService) {}

  async seed() {
    await this.seedRole();
    await this.seedFaculties();
    // ... semua logic di sini
  }

  private async seedRole() {
    /* 30 baris */
  }
  private async seedFaculties() {
    /* 30 baris */
  }
  private async seedUserDosen() {
    /* 100 baris */
  }
  // ... 300+ baris lagi
}
```

### Sesudah (Modular)

```typescript
// seeder.service.ts - Hanya orchestration
@Injectable()
export class SeederService {
  constructor(
    private readonly roleSeeder: RoleSeeder,
    private readonly facultySeeder: FacultySeeder,
    // ... inject seeders
  ) {}

  async seed() {
    await Promise.all([this.roleSeeder.run(), this.facultySeeder.run()]);
    // ... orchestrate saja
  }

  async seedSpecific(name: string) {
    // Fitur baru!
  }
}

// role.seeder.ts - Fokus pada role saja
@Injectable()
export class RoleSeeder extends BaseSeeder {
  async run() {
    /* 30 baris, fokus */
  }
}
```

## Best Practices

### ✅ DO

- Buat seeder baru sebagai class terpisah
- Extend dari `BaseSeeder`
- Gunakan `skipDuplicates: true`
- Log progress dengan `this.logger`
- Throw error untuk masalah kritis

### ❌ DON'T

- Jangan tambahkan logic baru ke `seeder.service.ts` (kecuali orchestration)
- Jangan bypass base class
- Jangan hardcode nilai (gunakan constants dari `data/`)

## Contoh Menambah Seeder Baru

```typescript
// 1. Buat file baru
// seeders/building.seeder.ts
@Injectable()
export class BuildingSeeder extends BaseSeeder {
  constructor(prismaService: PrismaService) {
    super(prismaService, BuildingSeeder.name);
  }

  async run(): Promise<void> {
    this.logger.log('Seeding buildings...');
    // ... logic
  }
}

// 2. Export di index.ts
export * from './building.seeder';

// 3. Register di module
@Module({
  providers: [..., BuildingSeeder],
})

// 4. Tambah ke service
constructor(
  // ...
  private readonly buildingSeeder: BuildingSeeder,
) {}

async seed() {
  // ...
  await this.buildingSeeder.run();
}
```

## Kesimpulan

Refactoring ini membuat codebase:

- 📦 **Lebih terorganisir** - File-file kecil dan fokus
- 🧪 **Lebih mudah di-test** - Unit test per seeder
- 🔧 **Lebih mudah di-maintain** - Temukan dan edit dengan cepat
- 🚀 **Lebih fleksibel** - Jalankan seeder tertentu saja
- 👥 **Lebih familiar** - Pattern seperti Laravel

Tanpa mengorbankan:

- ✅ Backward compatibility
- ✅ Data integrity
- ✅ Performance
