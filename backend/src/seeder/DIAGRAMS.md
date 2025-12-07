# Seeder Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       SeederModule                          │
├─────────────────────────────────────────────────────────────┤
│  Imports:                                                    │
│    • PrismaModule                                           │
│                                                              │
│  Providers:                                                 │
│    • SeederService (Orchestrator)                          │
│    • RoleSeeder                                             │
│    • FacultySeeder                                          │
│    • StudyProgramSeeder                                     │
│    • ReportCategorySeeder                                   │
│    • AdminUserSeeder                                        │
│    • PetugasUserSeeder                                      │
│    • DosenUserSeeder                                        │
│    • MahasiswaUserSeeder                                    │
│                                                              │
│  Exports:                                                   │
│    • SeederService                                          │
└─────────────────────────────────────────────────────────────┘
```

## Dependency Graph

```
                    SeederService
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   RoleSeeder    FacultySeeder   ReportCategorySeeder
        │                │
        │                ▼
        │        StudyProgramSeeder
        │                │
        │         ┌──────┴──────┐
        ▼         ▼             ▼
   AdminUser   DosenUser    MahasiswaUser
   PetugasUser
```

## Class Hierarchy

```
         BaseSeeder (Abstract)
                │
    ┌───────────┴───────────────────────────────┐
    │                                            │
    ├── RoleSeeder                               │
    ├── FacultySeeder                            │
    ├── StudyProgramSeeder                       │
    ├── ReportCategorySeeder                     │
    │                                            │
    └── User Seeders:                            │
        ├── AdminUserSeeder                      │
        ├── PetugasUserSeeder                    │
        ├── DosenUserSeeder                      │
        └── MahasiswaUserSeeder                  │
```

## Execution Flow

```
┌─────────────────────────────────────────────────────────┐
│                    seed() Called                        │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │   Parallel Batch #1   │
         │  ┌─────────────────┐  │
         │  │  RoleSeeder     │  │
         │  │  FacultySeeder  │  │
         │  │  ReportCategory │  │
         │  └─────────────────┘  │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   Sequential Run      │
         │  ┌─────────────────┐  │
         │  │ StudyProgram    │  │
         │  └─────────────────┘  │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   Parallel Batch #2   │
         │  ┌─────────────────┐  │
         │  │  AdminUser      │  │
         │  │  PetugasUser    │  │
         │  └─────────────────┘  │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   Sequential Run      │
         │  ┌─────────────────┐  │
         │  │  DosenUser      │  │
         │  └─────────────────┘  │
         └───────────┬───────────┘
                     │
         ┌───────────▼───────────┐
         │   Sequential Run      │
         │  ┌─────────────────┐  │
         │  │  MahasiswaUser  │  │
         │  └─────────────────┘  │
         └───────────┬───────────┘
                     │
                     ▼
             ✅ Seeding Complete
```

## Data Flow

```
JSON Files                 Seeders              Database
────────────             ────────────          ──────────

fakultas.json       →    FacultySeeder    →   faculty table
program_studi.json  →    StudyProgram     →   study_program table
                         Seeder

gabungan_dosen.json →    DosenUserSeeder  →   user table
                                               profile table

angkatan-2023.json  →    MahasiswaUser    →   user table
                         Seeder                profile table

Constants (data/)   →    RoleSeeder       →   role table
                         ReportCategory        kategori_barang
                         Seeder                table
```

## Request Flow (seedSpecific)

```
CLI: yarn seed:specific adminUser
           │
           ▼
    seed-specific.ts
           │
           ▼
    SeederService.seedSpecific('adminUser')
           │
           ▼
    Lookup seeder in mapping
           │
           ▼
    AdminUserSeeder.run()
           │
           ├─→ Check dependencies (Role)
           │
           ├─→ Check existing data
           │
           ├─→ Hash password
           │
           └─→ Create user via Prisma
                    │
                    ▼
              Database Updated
                    │
                    ▼
              ✅ Success logged
```

## Component Interaction

```
┌──────────────┐
│  seed.ts /   │
│  CLI         │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ SeederService    │◄──────┐
│ (Orchestrator)   │       │
└──────┬───────────┘       │
       │ inject            │ uses
       ▼                   │
┌──────────────────┐       │
│ Individual       │       │
│ Seeders          │───────┘
│ (8 classes)      │
└──────┬───────────┘
       │ extend
       ▼
┌──────────────────┐
│ BaseSeeder       │
│ (Abstract)       │
└──────┬───────────┘
       │ uses
       ▼
┌──────────────────┐
│ PrismaService    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Database         │
└──────────────────┘
```

## File Organization

```
backend/src/
├── seed.ts                      # Main seed script
├── seed-specific.ts             # Specific seed script
└── seeder/
    ├── README.md                # Full documentation
    ├── MIGRATION_GUIDE.md       # Migration info
    ├── QUICK_REFERENCE.md       # Quick guide
    ├── DIAGRAMS.md             # This file
    ├── seeder.module.ts         # NestJS module
    ├── seeder.service.ts        # Orchestrator
    ├── data/                    # Constants
    │   └── index.ts
    └── seeders/                 # Individual seeders
        ├── base.seeder.ts       # Base class
        ├── index.ts             # Barrel export
        ├── *.seeder.ts          # Seeder implementations
        └── *.seeder.spec.ts     # Tests
```

## Comparison: Before vs After

### Before (Monolithic)

```
SeederService (394 lines)
├── seed()
├── seedRole()           [private]
├── seedFaculties()      [private]
├── seedStudyPrograms()  [private]
├── seedReportCategories()[private]
├── seedUserAdmin()      [private]
├── seedUserPetugas()    [private]
├── seedUserDosen()      [private]
└── seedUserMahasiswa()  [private]
     ❌ Hard to maintain
     ❌ Hard to test
     ❌ No reusability
```

### After (Modular)

```
SeederService (90 lines)
├── seed()               [public]
└── seedSpecific()       [public]
     │
     ├─→ RoleSeeder.run()
     ├─→ FacultySeeder.run()
     ├─→ StudyProgramSeeder.run()
     ├─→ ReportCategorySeeder.run()
     ├─→ AdminUserSeeder.run()
     ├─→ PetugasUserSeeder.run()
     ├─→ DosenUserSeeder.run()
     └─→ MahasiswaUserSeeder.run()
          ✅ Easy to maintain
          ✅ Easy to test
          ✅ Highly reusable
```
