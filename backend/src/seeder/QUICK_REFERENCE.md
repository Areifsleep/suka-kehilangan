# Seeder Quick Reference

## 🚀 Command Line Usage

```bash
# Jalankan semua seeder
yarn seed

# Jalankan seeder spesifik
yarn seed:specific role
yarn seed:specific faculty
yarn seed:specific studyProgram
yarn seed:specific reportCategory
yarn seed:specific adminUser
yarn seed:specific petugasUser
yarn seed:specific dosenUser
yarn seed:specific mahasiswaUser
```

## 📋 Seeder yang Tersedia

| Seeder           | File                        | Dependency         | Description                       |
| ---------------- | --------------------------- | ------------------ | --------------------------------- |
| `role`           | `role.seeder.ts`            | -                  | Seed roles (ADMIN, USER, PETUGAS) |
| `faculty`        | `faculty.seeder.ts`         | -                  | Seed fakultas dari JSON           |
| `reportCategory` | `report-category.seeder.ts` | -                  | Seed kategori barang              |
| `studyProgram`   | `study-program.seeder.ts`   | Faculty            | Seed program studi                |
| `adminUser`      | `admin-user.seeder.ts`      | Role               | Seed user admin                   |
| `petugasUser`    | `petugas-user.seeder.ts`    | Role               | Seed 21 user petugas              |
| `dosenUser`      | `dosen-user.seeder.ts`      | Role, StudyProgram | Seed dosen dari JSON              |
| `mahasiswaUser`  | `mahasiswa-user.seeder.ts`  | Role, StudyProgram | Seed mahasiswa dari JSON          |

## 🔧 Programmatic Usage

```typescript
// Inject SeederService
constructor(private readonly seederService: SeederService) {}

// Jalankan semua
await this.seederService.seed();

// Jalankan spesifik
await this.seederService.seedSpecific('adminUser');
```

## 📁 File Structure

```
seeder/
├── seeders/              # Individual seeder classes
│   ├── *.seeder.ts      # Each seeder
│   ├── *.seeder.spec.ts # Tests
│   ├── base.seeder.ts   # Base class
│   └── index.ts         # Barrel export
├── data/                 # Constants & configs
├── seeder.service.ts    # Main orchestrator
├── seeder.module.ts     # Module definition
├── README.md            # Full documentation
├── MIGRATION_GUIDE.md   # Migration guide
└── QUICK_REFERENCE.md   # This file
```

## ✨ Creating New Seeder (Template)

```typescript
import { Injectable } from '@nestjs/common';
import { BaseSeeder } from './base.seeder';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MySeeder extends BaseSeeder {
  constructor(prismaService: PrismaService) {
    super(prismaService, MySeeder.name);
  }

  async run(): Promise<void> {
    this.logger.log('Seeding my data...');

    try {
      // Your seeding logic here
      await this.prismaService.myEntity.createMany({
        data: [...],
        skipDuplicates: true,
      });

      this.logger.log('Data berhasil di-seed.');
    } catch (error) {
      this.logger.error('Gagal melakukan seeding.', error.stack);
      throw error;
    }
  }
}
```

## 📝 Checklist Adding New Seeder

- [ ] Create `my-entity.seeder.ts` in `seeders/`
- [ ] Extend `BaseSeeder`
- [ ] Implement `run()` method
- [ ] Export in `seeders/index.ts`
- [ ] Add to `seeder.module.ts` providers
- [ ] Inject in `seeder.service.ts` constructor
- [ ] Add to `seed()` method in correct order
- [ ] Add to `seedSpecific()` mapping
- [ ] (Optional) Create test file `my-entity.seeder.spec.ts`
- [ ] Update this QUICK_REFERENCE.md table

## 🎯 Execution Order

```
1. Parallel:     Role, Faculty, ReportCategory
   ↓
2. Sequential:   StudyProgram (needs Faculty)
   ↓
3. Parallel:     AdminUser, PetugasUser (need Role)
   ↓
4. Sequential:   DosenUser (needs Role + StudyProgram)
   ↓
5. Sequential:   MahasiswaUser (needs Role + StudyProgram)
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run seeder tests only
yarn test seeder

# Run specific seeder test
yarn test role.seeder.spec
```

## 🐛 Troubleshooting

### Error: "Role ADMIN tidak ditemukan"

→ Run `role` seeder first: `yarn seed:specific role`

### Error: "Program Studi tidak ditemukan"

→ Run in order: `faculty` → `studyProgram`

### Error: Duplicate entry

→ Normal! Using `skipDuplicates: true` will skip existing records

### Want to reset and re-seed?

→ Clear database first, then run `yarn seed`

## 📚 More Info

- Full docs: `README.md`
- Migration guide: `MIGRATION_GUIDE.md`
- Example test: `role.seeder.spec.ts`
