// auth.service.spec.ts

import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';

import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('argon2');
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'), // Import modul asli
  randomUUID: jest.fn(), // Mock hanya fungsi randomUUID
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  // Mock data untuk digunakan di berbagai tes
  const mockUser = {
    id_user: 1,
    username: 'testuser',
    password: 'hashedpassword', // Anggap ini password yang sudah di-hash
  };

  const mockToken = 'a-fixed-uuid-for-testing';

  // Objek mock untuk PrismaService
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    session: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, // Gunakan objek mock sebagai provider
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Reset semua mock sebelum setiap tes untuk memastikan isolasi
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Grup tes untuk metode login
  describe('login', () => {
    // Skenario 1: Login berhasil (Happy Path)
    it('should return a token on successful login', async () => {
      // Arrange: Siapkan kondisi untuk tes
      // - Prisma menemukan user
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      // - Argon2 memverifikasi password sebagai benar
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      // - randomUUID mengembalikan token yang kita tentukan
      (crypto.randomUUID as jest.Mock).mockReturnValue(mockToken);
      // - Prisma berhasil membuat sesi
      mockPrismaService.session.create.mockResolvedValue({
        id_session: 1,
        id_user: mockUser.id_user,
        token: mockToken,
      });

      // Act: Panggil metode yang akan diuji
      const result = await service.login('testuser', 'correctpassword');

      // Assert: Periksa hasilnya
      expect(result).toBe(mockToken);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(argon2.verify).toHaveBeenCalledWith(
        mockUser.password,
        'correctpassword',
      );
      expect(prismaService.session.create).toHaveBeenCalledWith({
        data: {
          id_user: mockUser.id_user,
          token: mockToken,
        },
      });
    });

    // Skenario 2: User tidak ditemukan
    it('should throw HttpException if user is not found', async () => {
      // Arrange: Prisma tidak menemukan user (mengembalikan null)
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Act & Assert: Pastikan metode melempar error yang tepat
      await expect(service.login('unknownuser', 'anypassword')).rejects.toThrow(
        new HttpException(
          'Username or password is incorrect',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    });

    // Skenario 3: Password salah
    it('should throw HttpException if password does not match', async () => {
      // Arrange:
      // - Prisma menemukan user
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      // - Argon2 memverifikasi password sebagai salah
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      // Act & Assert:
      await expect(service.login('testuser', 'wrongpassword')).rejects.toThrow(
        new HttpException(
          'Username or password is incorrect',
          HttpStatus.UNAUTHORIZED,
        ),
      );

      // Pastikan proses berhenti dan tidak mencoba membuat session
      expect(prismaService.session.create).not.toHaveBeenCalled();
    });
  });
});
