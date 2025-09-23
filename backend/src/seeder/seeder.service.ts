import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

// Data permissions diimpor langsung dari file JSON yang Anda berikan
const permissionsData = [
  {
    group: 'Laporan (Reports)',
    permissions: [
      {
        name: 'CREATE-REPORT-LOST',
        description: 'Membuat laporan kehilangan barang baru.',
        roles: ['User'],
      },
      {
        name: 'CREATE-REPORT-FOUND',
        description: 'Membuat laporan penemuan barang baru.',
        roles: ['Petugas'],
      },
      {
        name: 'VIEW-OWN-REPORTS',
        description: 'Melihat daftar laporan yang dibuat oleh diri sendiri.',
        roles: ['User', 'Petugas'],
      },
      {
        name: 'VIEW-ALL-REPORTS',
        description:
          'Melihat semua laporan (hilang & ditemukan) dari semua pengguna.',
        roles: ['Petugas', 'Admin'],
      },
      {
        name: 'UPDATE-OWN-REPORT',
        description: 'Mengubah detail laporan milik sendiri.',
        roles: ['User', 'Petugas'],
      },
      {
        name: 'UPDATE-ANY-REPORT',
        description: 'Mengubah detail laporan milik pengguna mana pun.',
        roles: ['Petugas', 'Admin'],
      },
      {
        name: 'UPDATE-REPORT-STATUS',
        description:
          "Mengubah status laporan (cth: 'diverifikasi', 'sudah diklaim').",
        roles: ['Petugas', 'Admin'],
      },
      {
        name: 'DELETE-OWN-REPORT',
        description: 'Menghapus/membatalkan laporan milik sendiri.',
        roles: ['User', 'Petugas'],
      },
      {
        name: 'DELETE-ANY-REPORT',
        description: 'Menghapus laporan milik pengguna mana pun.',
        roles: ['Admin'],
      },
    ],
  },
  {
    group: 'Klaim Barang (Item Claims)',
    permissions: [
      {
        name: 'CREATE-CLAIM',
        description: 'Mengajukan klaim terhadap barang yang ditemukan.',
        roles: ['User'],
      },
      {
        name: 'VIEW-CLAIMS',
        description: 'Melihat daftar klaim yang masuk untuk sebuah barang.',
        roles: ['Petugas', 'Admin'],
      },
      {
        name: 'VERIFY-CLAIM',
        description: 'Memverifikasi dan menyetujui klaim dari pengguna.',
        roles: ['Petugas', 'Admin'],
      },
    ],
  },
  {
    group: 'Manajemen Pengguna & Akun',
    permissions: [
      {
        name: 'MANAGE-OWN-ACCOUNT',
        description: 'Mengubah profil dan password akun sendiri.',
        roles: ['User', 'Petugas', 'Admin'],
      },
      {
        name: 'MANAGE-USERS',
        description: 'Melihat, mengubah, dan menghapus akun Mahasiswa/Dosen.',
        roles: ['Admin'],
      },
      {
        name: 'MANAGE-OFFICERS',
        description: 'Mendaftarkan, mengubah, dan menghapus akun Petugas.',
        roles: ['Admin'],
      },
    ],
  },
  {
    group: 'Data Master & Sistem',
    permissions: [
      {
        name: 'VIEW-DASHBOARD',
        description: 'Mengakses halaman dashboard dengan statistik laporan.',
        roles: ['Petugas', 'Admin'],
      },
      {
        name: 'MANAGE-CATEGORIES',
        description: 'Menambah, mengubah, dan menghapus kategori barang.',
        roles: ['Petugas', 'Admin'],
      },
      {
        name: 'MANAGE-LOCATIONS',
        description: 'Menambah, mengubah, dan menghapus lokasi penemuan.',
        roles: ['Petugas', 'Admin'],
      },
      {
        name: 'EXPORT-REPORTS',
        description: 'Mengekspor data laporan ke dalam file (cth: Excel, PDF).',
        roles: ['Admin'],
      },
    ],
  },
];

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Fungsi utama untuk menjalankan semua proses seeding.
   */
  async seed() {
    this.logger.log('Memulai proses seeding...');

    // Panggil fungsi-fungsi seeder secara berurutan
    await this.seedRole();
    await this.seedPermissions();
    await this.seedRolePermissions(); // Menghubungkan role dan permission
    // await this.seedAdminUser();
    await this.seedInitialUsersForAllRoles();

    this.logger.log('Proses seeding selesai.');
  }

  /**
   * Seeder untuk data Role.
   */
  private async seedRole() {
    this.logger.log('Seeding data role...');
    // Nama role harus konsisten dengan yang ada di kode dan database
    const rolesToCreate = ['ADMIN', 'USER', 'PETUGAS'];

    const data = rolesToCreate.map((name) => ({ name }));

    try {
      await this.prismaService.role.createMany({
        data,
        skipDuplicates: true, // Lewati jika data sudah ada
      });
      this.logger.log('Data role berhasil di-seed.');
    } catch (error) {
      this.logger.error('Gagal melakukan seeding data role.', error.stack);
    }
  }

  /**
   * Seeder untuk data Permission.
   */
  private async seedPermissions() {
    this.logger.log('Seeding data permissions...');

    const permissions = permissionsData.flatMap((group) =>
      group.permissions.map((p) => ({
        name: p.name,
        description: p.description,
      })),
    );

    try {
      await this.prismaService.permission.createMany({
        data: permissions,
        skipDuplicates: true, // Lewati jika nama permission sudah ada
      });
      this.logger.log('Data permissions berhasil di-seed.');
    } catch (error) {
      this.logger.error(
        'Gagal melakukan seeding data permissions.',
        error.stack,
      );
    }
  }

  /**
   * Seeder untuk menghubungkan Roles dan Permissions.
   */
  private async seedRolePermissions() {
    this.logger.log('Menghubungkan roles dengan permissions...');
    try {
      // 1. Ambil semua role dan permission dari DB untuk mendapatkan ID-nya
      const roles = await this.prismaService.role.findMany();
      const permissions = await this.prismaService.permission.findMany();

      // 2. Buat map untuk pencarian cepat berdasarkan nama
      const roleMap = new Map(roles.map((r) => [r.name.toUpperCase(), r.id]));
      const permissionMap = new Map(permissions.map((p) => [p.name, p.id]));

      const rolePermissionData: { role_id: string; permission_id: string }[] =
        [];

      // Mapping nama role dari JSON ke nama di database
      const roleNameMapping = {
        Admin: 'ADMIN',
        User: 'USER',
        Petugas: 'PETUGAS',
      };

      // 3. Iterasi data JSON untuk membuat relasi
      for (const group of permissionsData) {
        for (const perm of group.permissions) {
          const permissionId = permissionMap.get(perm.name);
          if (!permissionId) continue;

          for (const roleName of perm.roles) {
            const dbRoleName = roleNameMapping[roleName];
            const roleId = roleMap.get(dbRoleName);
            if (roleId) {
              rolePermissionData.push({
                role_id: roleId,
                permission_id: permissionId,
              });
            }
          }
        }
      }

      // 4. Masukkan semua data relasi sekaligus
      if (rolePermissionData.length > 0) {
        await this.prismaService.rolePermissions.createMany({
          data: rolePermissionData,
          skipDuplicates: true,
        });
      }

      this.logger.log('Berhasil menghubungkan roles dengan permissions.');
    } catch (error) {
      this.logger.error(
        'Gagal menghubungkan roles dengan permissions.',
        error.stack,
      );
    }
  }

  /**
   * Seeder untuk data User Admin.
   */
  // private async seedAdminUser() {
  //   this.logger.log('Seeding data admin...');
  //   const adminData = [{
  //     username: 'admin',
  //     password: 'admin123',
  //     role: 'ADMIN',
  //     email: 'admin@gmail.com',
  //     full_name: 'Administrator',
  //   }];

  //   try {
  //     const adminExists = await this.prismaService.user.findUnique({
  //       where: { username: adminData.username },
  //     });

  //     if (adminExists) {
  //       this.logger.log('User admin sudah ada, seeding dilewati.');
  //       return;
  //     }

  //     const hashedPassword = await argon2.hash(adminData.password);

  //     const adminRole = await this.prismaService.role.findFirst({
  //       where: { name: adminData.role },
  //     });

  //     if (!adminRole) {
  //       throw new Error(
  //         'Role ADMIN tidak ditemukan. Pastikan role sudah di-seed terlebih dahulu.',
  //       );
  //     }

  //     await this.prismaService.user.create({
  //       data: {
  //         username: adminData.username,
  //         password: hashedPassword,
  //         email: adminData.email,
  //         role_id: adminRole.id,
  //         full_name: adminData.full_name,
  //       },
  //     });
  //     this.logger.log('Data admin berhasil di-seed.');
  //   } catch (error) {
  //     this.logger.error('Gagal melakukan seeding data admin.', error.stack);
  //   }
  // }

  private async seedInitialUsersForAllRoles() {
    this.logger.log('Seeding initial users for all roles...');
    try {
      // 1. Ambil semua role yang ada di database
      const allRoles = await this.prismaService.role.findMany();

      if (!allRoles || allRoles.length === 0) {
        this.logger.warn(
          'No roles found in the database. Skipping user seeding.',
        );
        return;
      }

      // 2. Lakukan perulangan untuk setiap role
      for (const role of allRoles) {
        const username = role.name.toLowerCase(); // e.g., 'ADMIN' -> 'admin'
        const email = `${username}@example.com`;
        const fullName = `${role.name.charAt(0).toUpperCase() + role.name.slice(1).toLowerCase()} User`; // e.g., 'ADMIN' -> 'Admin User'
        const password = 'password123'; // Gunakan password default yang aman

        // 3. Cek apakah user untuk role ini sudah ada
        const userExists = await this.prismaService.user.findUnique({
          where: { username },
        });

        if (userExists) {
          this.logger.log(
            `User '${username}' already exists, skipping seeding.`,
          );
          continue; // Lanjut ke role berikutnya
        }

        // 4. Hash password dan buat user baru
        const hashedPassword = await argon2.hash(password);

        await this.prismaService.user.create({
          data: {
            username: username,
            password: hashedPassword,
            email: email,
            full_name: fullName,
            role_id: role.id, // Gunakan id dari role yang sedang di-loop
          },
        });

        this.logger.log(
          `Successfully seeded user '${username}' with role '${role.name}'.`,
        );
      }

      this.logger.log('Finished seeding initial users.');
    } catch (error) {
      this.logger.error('Failed to seed initial users.', error.stack);
    }
  }
}
