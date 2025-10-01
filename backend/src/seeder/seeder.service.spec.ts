import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { LokasiPos } from '@prisma/client';
import * as argon2 from 'argon2';

import { SeederService } from './seeder.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  PERMISSIONS_DATA,
  GENERIC_PASSWORD,
  ROLES_DATA,
  ROLE_NAME_MAPPING,
  REPORT_CATEGORIES_DATA,
} from '../constants/config-seed';

// Mock the JSON data imports
jest.mock('../../process_data/fakultas.json', () => [
  {
    id_fakultas: 'FAK001',
    nama: 'Fakultas Test',
    kode_fakultas: 'FT',
    singkatan: 'FT',
  },
]);

jest.mock('../../process_data/angkatan-2023.json', () => [
  {
    NIM: 12345678,
    NAMA: 'Test Student',
    FORMATED_NAMA: 'Test Student',
    KODE_PRODI: 'TI',
  },
]);

jest.mock('../../process_data/gabungan_dosen.json', () => [
  {
    nip: '123456789',
    nama_dosen: 'Dr. Test Dosen',
    kode_prodi: 'TI',
  },
]);

jest.mock('../../process_data/program_studi.json', () => [
  {
    id_prodi: 'PRODI001',
    id_fakultas: 'FAK001',
    nama: 'Teknik Informatika',
    kode_prodi: 'TI',
    jenjang_studi: 'S1',
  },
]);

// Mock argon2
jest.mock('argon2');
const mockedArgon2 = argon2 as jest.Mocked<typeof argon2>;

describe('SeederService', () => {
  let service: SeederService;
  let prismaService: PrismaService;
  let loggerSpy: jest.SpyInstance;

  const mockPrismaService = {
    role: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    permission: {
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
    rolePermissions: {
      createMany: jest.fn(),
    },
    faculty: {
      createMany: jest.fn(),
    },
    studyProgram: {
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
    reportCategory: {
      createMany: jest.fn(),
    },
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Mock Logger
    loggerSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();

    // Mock argon2.hash
    mockedArgon2.hash.mockResolvedValue('hashedPassword');

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('seed', () => {
    it('should run all seeding processes', async () => {
      // Mock all required data for sub-methods
      mockPrismaService.role.findMany.mockResolvedValue([
        { id: 'role1', name: 'ADMIN' },
        { id: 'role2', name: 'USER' },
      ]);

      mockPrismaService.permission.findMany.mockResolvedValue([
        { id: 'perm1', name: 'read_users' },
      ]);

      mockPrismaService.role.findFirst.mockResolvedValue({
        id: 'role1',
        name: 'ADMIN',
      });
      mockPrismaService.studyProgram.findMany.mockResolvedValue([
        { id: 'prodi1', code: 'TI' },
      ]);
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await service.seed();

      expect(loggerSpy).toHaveBeenCalledWith('Memulai proses seeding...');
      expect(loggerSpy).toHaveBeenCalledWith('Proses seeding selesai.');
    });
  });

  describe('seedRole', () => {
    it('should successfully seed roles', async () => {
      mockPrismaService.role.createMany.mockResolvedValue({
        count: ROLES_DATA.length,
      });

      // Use reflection to call private method
      await (service as any).seedRole();

      expect(mockPrismaService.role.createMany).toHaveBeenCalledWith({
        data: ROLES_DATA.map((name) => ({ name })),
        skipDuplicates: true,
      });
      expect(loggerSpy).toHaveBeenCalledWith('Seeding data role...');
      expect(loggerSpy).toHaveBeenCalledWith('Data role berhasil di-seed.');
    });

    it('should handle error when seeding roles', async () => {
      const error = new Error('Database error');
      mockPrismaService.role.createMany.mockRejectedValue(error);

      const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');

      await (service as any).seedRole();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Gagal melakukan seeding data role.',
        error.stack,
      );
    });
  });

  describe('seedPermissions', () => {
    it('should successfully seed permissions', async () => {
      mockPrismaService.permission.createMany.mockResolvedValue({ count: 1 });

      await (service as any).seedPermissions();

      const expectedPermissions = PERMISSIONS_DATA.flatMap((group) =>
        group.permissions.map((p) => ({
          name: p.name,
          description: p.description,
        })),
      );

      expect(mockPrismaService.permission.createMany).toHaveBeenCalledWith({
        data: expectedPermissions,
        skipDuplicates: true,
      });
      expect(loggerSpy).toHaveBeenCalledWith(
        'Data permissions berhasil di-seed.',
      );
    });

    it('should handle error when seeding permissions', async () => {
      const error = new Error('Permission error');
      mockPrismaService.permission.createMany.mockRejectedValue(error);

      const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');

      await (service as any).seedPermissions();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Gagal melakukan seeding data permissions.',
        error.stack,
      );
    });
  });

  describe('seedRolePermissions', () => {
    it('should successfully seed role permissions', async () => {
      // Mock data yang sesuai dengan PERMISSIONS_DATA dari constants
      const mockRoles = [
        { id: 'role1', name: 'ADMIN' },
        { id: 'role2', name: 'USER' },
      ];

      // Mock permissions yang ada di PERMISSIONS_DATA
      const mockPermissions = [
        { id: 'perm1', name: 'read_users' },
        { id: 'perm2', name: 'create_reports' },
      ];

      mockPrismaService.role.findMany.mockResolvedValue(mockRoles);
      mockPrismaService.permission.findMany.mockResolvedValue(mockPermissions);
      mockPrismaService.rolePermissions.createMany.mockResolvedValue({
        count: 1,
      });

      await (service as any).seedRolePermissions();

      expect(mockPrismaService.role.findMany).toHaveBeenCalled();
      expect(mockPrismaService.permission.findMany).toHaveBeenCalled();
      // Hanya expect rolePermissions.createMany jika ada data yang valid
      expect(loggerSpy).toHaveBeenCalledWith(
        'Berhasil menghubungkan roles dengan permissions.',
      );
    });

    it('should handle error when seeding role permissions', async () => {
      const error = new Error('Role permission error');
      mockPrismaService.role.findMany.mockRejectedValue(error);

      const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');

      await (service as any).seedRolePermissions();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Gagal menghubungkan roles dengan permissions.',
        error.stack,
      );
    });
  });

  describe('seedFaculties', () => {
    it('should successfully seed faculties', async () => {
      mockPrismaService.faculty.createMany.mockResolvedValue({ count: 1 });

      await (service as any).seedFaculties();

      expect(mockPrismaService.faculty.createMany).toHaveBeenCalledWith({
        data: [
          {
            id: 'FAK001',
            name: 'Fakultas Test',
            code: 'FT',
            abbreviation: 'FT',
          },
        ],
        skipDuplicates: true,
      });
    });
  });

  describe('seedStudyPrograms', () => {
    it('should successfully seed study programs', async () => {
      mockPrismaService.studyProgram.createMany.mockResolvedValue({ count: 1 });

      await (service as any).seedStudyPrograms();

      expect(mockPrismaService.studyProgram.createMany).toHaveBeenCalledWith({
        data: [
          {
            id: 'PRODI001',
            faculty_id: 'FAK001',
            name: 'Teknik Informatika',
            code: 'TI',
            level: 'S1',
          },
        ],
        skipDuplicates: true,
      });
      expect(loggerSpy).toHaveBeenCalledWith(
        'Berhasil melakukan seeding data program studi.',
      );
    });

    it('should handle different education levels', async () => {
      // Mock different level data
      jest.doMock('../../process_data/program_studi.json', () => [
        {
          id_prodi: 'PRODI002',
          id_fakultas: 'FAK001',
          nama: 'Program S2',
          kode_prodi: 'S2',
          jenjang_studi: 'S2',
        },
        {
          id_prodi: 'PRODI003',
          id_fakultas: 'FAK001',
          nama: 'Program S3',
          kode_prodi: 'S3',
          jenjang_studi: 'S3',
        },
      ]);

      mockPrismaService.studyProgram.createMany.mockResolvedValue({ count: 2 });

      await (service as any).seedStudyPrograms();

      expect(mockPrismaService.studyProgram.createMany).toHaveBeenCalled();
    });

    it('should handle error when seeding study programs', async () => {
      const error = new Error('Study program error');
      mockPrismaService.studyProgram.createMany.mockRejectedValue(error);

      const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');

      await (service as any).seedStudyPrograms();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Gagal melakukan seeding data program studi.',
        error.stack,
      );
    });
  });

  describe('seedReportCategories', () => {
    it('should successfully seed report categories', async () => {
      mockPrismaService.reportCategory.createMany.mockResolvedValue({
        count: REPORT_CATEGORIES_DATA.length,
      });

      await (service as any).seedReportCatgories();

      expect(mockPrismaService.reportCategory.createMany).toHaveBeenCalledWith({
        data: REPORT_CATEGORIES_DATA,
        skipDuplicates: true,
      });
      expect(loggerSpy).toHaveBeenCalledWith(
        'Berhasil melakukan seeding data kategori laporan.',
      );
    });

    it('should handle error when seeding report categories', async () => {
      const error = new Error('Report category error');
      mockPrismaService.reportCategory.createMany.mockRejectedValue(error);

      const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');

      await (service as any).seedReportCatgories();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Gagal melakukan seeding data kategori laporan.',
        error.stack,
      );
    });
  });

  describe('seedUserAdmin', () => {
    it('should successfully create admin user', async () => {
      mockPrismaService.role.findFirst.mockResolvedValue({
        id: 'admin-role-id',
        name: 'ADMIN',
      });
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({ id: 'admin-user-id' });

      await (service as any).seedUserAdmin();

      expect(mockPrismaService.role.findFirst).toHaveBeenCalledWith({
        where: { name: 'ADMIN' },
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'admin' },
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: 'admin',
          password: 'hashedPassword',
          role_id: 'admin-role-id',
          profile: {
            create: {
              full_name: 'Administrator',
              email: 'admin@uin-suka.ac.id',
            },
          },
        },
      });
      expect(loggerSpy).toHaveBeenCalledWith('Berhasil membuat user "admin".');
    });

    it('should skip if admin role not found', async () => {
      mockPrismaService.role.findFirst.mockResolvedValue(null);

      const loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn');

      await (service as any).seedUserAdmin();

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Role "ADMIN" tidak ditemukan. Seeding admin dilewati.',
      );
    });

    it('should skip if admin user already exists', async () => {
      mockPrismaService.role.findFirst.mockResolvedValue({
        id: 'admin-role-id',
        name: 'ADMIN',
      });
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-admin',
      });

      await (service as any).seedUserAdmin();

      expect(loggerSpy).toHaveBeenCalledWith(
        'User "admin" sudah ada, seeding dilewati.',
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should handle error when creating admin user', async () => {
      mockPrismaService.role.findFirst.mockResolvedValue({
        id: 'admin-role-id',
        name: 'ADMIN',
      });
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const error = new Error('User creation error');
      mockPrismaService.user.create.mockRejectedValue(error);

      const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');

      await (service as any).seedUserAdmin();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Gagal melakukan seeding user admin.',
        error.stack,
      );
    });
  });

  describe('seedUserPetugas', () => {
    it('should successfully create petugas users', async () => {
      mockPrismaService.role.findFirst.mockResolvedValue({
        id: 'petugas-role-id',
        name: 'PETUGAS',
      });
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'petugas-user-id',
      });

      await (service as any).seedUserPetugas();

      // Should create 21 petugas users
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(21);

      // Check first user creation call
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: 'petugas01',
          password: 'hashedPassword',
          role_id: 'petugas-role-id',
          profile: {
            create: {
              full_name: 'Petugas 01',
              email: 'petugas01@uin-suka.ac.id',
              lokasi_pos: expect.any(String),
            },
          },
        },
      });

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /Berhasil membuat user \"petugas\d{2}\" dengan lokasi pos (POS_BARAT|POS_TIMUR)\./,
        ),
      );
    });

    it('should skip if petugas role not found', async () => {
      mockPrismaService.role.findFirst.mockResolvedValue(null);

      const loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn');

      await (service as any).seedUserPetugas();

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Role "PETUGAS" tidak ditemukan. Seeding petugas dilewati.',
      );
    });

    it('should skip if petugas user already exists', async () => {
      mockPrismaService.role.findFirst.mockResolvedValue({
        id: 'petugas-role-id',
        name: 'PETUGAS',
      });
      mockPrismaService.user.findFirst.mockResolvedValue({
        id: 'existing-petugas',
      });

      await (service as any).seedUserPetugas();

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          username: {
            startsWith: 'petugas',
          },
        },
      });
      expect(loggerSpy).toHaveBeenCalledWith(
        'User petugas sudah ada, seeding dilewati.',
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should handle error when creating petugas users', async () => {
      mockPrismaService.role.findFirst.mockResolvedValue({
        id: 'petugas-role-id',
        name: 'PETUGAS',
      });
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      const error = new Error('User creation error');
      mockPrismaService.user.create.mockRejectedValue(error);

      const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');

      await (service as any).seedUserPetugas();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Gagal melakukan seeding user petugas.',
        error.stack,
      );
    });
  });

  describe('seedUserDosen', () => {
    beforeEach(() => {
      mockPrismaService.role.findFirst.mockResolvedValue({
        id: 'user-role-id',
        name: 'USER',
      });
      mockPrismaService.studyProgram.findMany.mockResolvedValue([
        { id: 'prodi1', code: 'TI' },
      ]);
      mockPrismaService.user.findMany.mockResolvedValue([]);
    });

    it('should successfully create lecturer users', async () => {
      mockPrismaService.user.create.mockResolvedValue({
        id: 'lecturer-user-id',
      });

      await (service as any).seedUserDosen();

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: '123456789',
          password: 'hashedPassword',
          role_id: 'user-role-id',
          profile: {
            create: {
              full_name: 'Dr. Test Dosen',
              email: '123456789@uin-suka.ac.id',
              nip: '123456789',
              study_program_id: 'prodi1',
            },
          },
        },
      });
      expect(loggerSpy).toHaveBeenCalledWith(
        'Berhasil membuat 1 user dosen baru.',
      );
    });

    it('should skip if user role not found', async () => {
      mockPrismaService.role.findFirst.mockResolvedValue(null);

      const loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn');

      await (service as any).seedUserDosen();

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Role "USER" tidak ditemukan. Seeding dosen dilewati.',
      );
    });

    it('should skip lecturers with existing usernames', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([
        { username: '123456789' },
      ]);

      await (service as any).seedUserDosen();

      expect(loggerSpy).toHaveBeenCalledWith(
        'Tidak ada data dosen baru untuk di-seed.',
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should skip lecturers with invalid study program codes', async () => {
      mockPrismaService.studyProgram.findMany.mockResolvedValue([
        { id: 'prodi2', code: 'SI' }, // Different code from mock data
      ]);

      const loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn');

      await (service as any).seedUserDosen();

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Program Studi dengan kode "TI" tidak ditemukan untuk dosen "Dr. Test Dosen". Data dilewati.',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Tidak ada data dosen baru untuk di-seed.',
      );
    });

    it('should handle error when creating lecturer users', async () => {
      const error = new Error('User creation error');
      mockPrismaService.user.create.mockRejectedValue(error);

      const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');

      await (service as any).seedUserDosen();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Gagal melakukan seeding user dosen.',
        error.stack,
      );
    });
  });

  describe('seedUserMahasiswa', () => {
    beforeEach(() => {
      mockPrismaService.role.findFirst.mockResolvedValue({
        id: 'user-role-id',
        name: 'USER',
      });
      mockPrismaService.studyProgram.findMany.mockResolvedValue([
        { id: 'prodi1', code: 'TI' },
      ]);
      mockPrismaService.user.findMany.mockResolvedValue([]);
    });

    it('should successfully create student users', async () => {
      mockPrismaService.user.create.mockResolvedValue({
        id: 'student-user-id',
      });

      await (service as any).seedUserMahasiswa();

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: '12345678',
          password: 'hashedPassword',
          role_id: 'user-role-id',
          profile: {
            create: {
              full_name: 'Test Student',
              email: '12345678@student.uin-suka.ac.id',
              nim: '12345678',
              study_program_id: 'prodi1',
            },
          },
        },
      });
      expect(loggerSpy).toHaveBeenCalledWith(
        'Berhasil membuat 1 user mahasiswa baru.',
      );
    });

    it('should skip if user role not found', async () => {
      mockPrismaService.role.findFirst.mockResolvedValue(null);

      const loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn');

      await (service as any).seedUserMahasiswa();

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Role "USER" tidak ditemukan. Seeding mahasiswa dilewati.',
      );
    });

    it('should skip students with existing usernames', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([
        { username: '12345678' },
      ]);

      await (service as any).seedUserMahasiswa();

      expect(loggerSpy).toHaveBeenCalledWith(
        'Tidak ada data mahasiswa baru untuk di-seed.',
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should skip students with invalid study program codes', async () => {
      mockPrismaService.studyProgram.findMany.mockResolvedValue([
        { id: 'prodi2', code: 'SI' }, // Different code from mock data
      ]);

      const loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn');

      await (service as any).seedUserMahasiswa();

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Program Studi dengan kode "TI" tidak ditemukan untuk mahasiswa "Test Student". Data dilewati.',
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        'Tidak ada data mahasiswa baru untuk di-seed.',
      );
    });

    it('should handle error when creating student users', async () => {
      const error = new Error('User creation error');
      mockPrismaService.user.create.mockRejectedValue(error);

      const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error');

      await (service as any).seedUserMahasiswa();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Gagal melakukan seeding user mahasiswa.',
        error.stack,
      );
    });
  });
});
