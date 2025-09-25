<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Suka Kehilangan - Backend API

Backend aplikasi sistem informasi barang hilang dan ditemukan untuk kampus UIN Sunan Kalijaga Yogyakarta. Dibangun menggunakan [NestJS](https://nestjs.com/) framework dengan TypeScript, Prisma ORM, dan MySQL database.

## 🚀 Fitur Utama

- **Autentikasi & Otorisasi**: JWT-based authentication dengan refresh token
- **Manajemen Role & Permission**: Multi-role system (Admin, Petugas, User)
- **Report System**: CRUD untuk laporan barang hilang dan ditemukan
- **File Upload**: Dukungan upload gambar untuk laporan
- **Database Seeding**: Automated seeding untuk data fakultas, prodi, dan user

## 📋 Prerequisites

Pastikan sistem Anda telah menginstall:

- **Node.js** (versi 18.x atau lebih tinggi)
- **npm** atau **yarn** sebagai package manager
- **MySQL** (versi 8.x atau lebih tinggi)
- **Git** untuk version control

## 🛠️ Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root directory dan isi dengan konfigurasi berikut:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/suka_kehilangan_db"

# JWT Configuration
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="15m"

# Refresh Token Configuration
REFRESH_JWT_SECRET="your-refresh-jwt-secret-key"
REFRESH_JWT_EXPIRES_IN="7d"

# Node Environment
NODE_ENV="development"

# Upload Configuration (Optional)
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/jpg"
```

⚠️ **Penting**: Ganti `username`, `password`, dan nama database sesuai dengan konfigurasi MySQL Anda.

## 🗄️ Setup Database

### 1. Buat Database MySQL

```sql
CREATE DATABASE suka_kehilangan_db;
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Jalankan Database Migration

```bash
npx prisma migrate deploy
```

atau untuk development:

```bash
npx prisma migrate dev
```

Perintah `prisma studio` akan membuka web interface untuk melihat database di browser.

## 🌱 Setup Data Seeder

### 1. Jalankan Seeder

Setelah database siap, jalankan seeder untuk mengisi data awal:

```bash
npm run seed
```

### 2. Data yang Akan Di-seed

Seeder akan mengisi database dengan:

- ✅ **Fakultas**: Data fakultas UIN Sunan Kalijaga
- ✅ **Program Studi**: Data program studi dari semua fakultas
- ✅ **Roles**: Admin, Petugas, User
- ✅ **Permissions**: Hak akses untuk setiap role
- ✅ **Report Categories**: Kategori barang (elektronik, dokumen, aksesoris, dll.)
- ✅ **Users**: Sample users (admin, petugas, dosen, mahasiswa)

### 3. Default User Accounts

Setelah seeding, Anda dapat login menggunakan akun berikut:

| Role      | Username          | Password   | Email                        |
| --------- | ----------------- | ---------- | ---------------------------- |
| Admin     | `admin`           | `12345678` | admin@kampus.ac.id           |
| Petugas   | `petugas01`       | `12345678` | petugas01@kampus.ac.id       |
| Dosen     | `[NIP_DOSEN]`     | `12345678` | [nip]@uin-suka.ac.id         |
| Mahasiswa | `[NIM_MAHASISWA]` | `12345678` | [nim]@student.uin-suka.ac.id |

⚠️ **Keamanan**: Pastikan untuk mengubah password default setelah instalasi!

## 🚀 Menjalankan Aplikasi

### Development Mode

```bash
# Jalankan dalam mode development (auto-reload)
npm run start:dev
```

### Production Mode

```bash
# Build aplikasi untuk production
npm run build

# Jalankan dalam mode production
npm run start:prod
```

### Debug Mode

```bash
# Jalankan dengan debugger
npm run start:debug
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🧪 Testing

### Unit Tests

```bash
# Jalankan unit tests
npm run test

# Jalankan tests dengan watch mode
npm run test:watch

# Jalankan tests dengan coverage report
npm run test:cov
```

### End-to-End Tests

```bash
# Jalankan e2e tests
npm run test:e2e
```

### Debug Tests

```bash
# Debug tests
npm run test:debug
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `POST /auth/sessions` Mendapatkan current user yang sedang login

## 🗂️ Struktur Project

```
src/
├── auth/              # Authentication module
│   ├── guards/        # Auth guards (JWT, Local, etc.)
│   ├── strategies/    # Passport strategies
│   └── dtos/          # Data transfer objects
├── user/              # User management module
├── prisma/            # Prisma service
├── seeder/            # Database seeder
├── constants/         # Application constants
├── models/            # Response models
└── utils/             # Utility functions
```

## 🔧 Troubleshooting

### Database Connection Issues

1. **Error: Access denied for user**

   ```bash
   # Pastikan credentials di .env sudah benar
   # Periksa user MySQL memiliki akses ke database
   ```

2. **Error: Database doesn't exist**
   ```bash
   # Buat database terlebih dahulu
   CREATE DATABASE suka_kehilangan_db;
   ```

### Migration Issues

1. **Reset Migration (Development Only)**

   ```bash
   npx prisma migrate reset
   npx prisma migrate dev
   ```

2. **Schema Drift**
   ```bash
   npx prisma db push
   ```

### Seeding Issues

1. **Seeding gagal - Data sudah ada**
   - Seeder dirancang untuk skip duplicate data
   - Safe untuk dijalankan berulang kali

2. **Role/Permission tidak sesuai**
   ```bash
   # Hapus data role dan permission, lalu seed ulang
   # Atau check konfigurasi di src/constants/config-seed.ts
   ```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## 🔗 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io/) - JWT Debugger
