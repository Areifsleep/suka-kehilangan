# Suka Kehilangan: Aplikasi Pelaporan Barang Hilang UIN Sunan Kalijaga

Suka Kehilangan adalah aplikasi pelaporan barang hilang yang dirancang khusus untuk lingkungan UIN Sunan Kalijaga.
Aplikasi ini bertujuan untuk mempermudah civitas akademika dalam melaporkan serta menemukan kembali barang yang hilang di area kampus.

### Fitur Utama

- Pelaporan Barang Hilang — Pengguna dapat melaporkan barang yang hilang dengan detail seperti jenis barang, lokasi, tanggal, dan deskripsi.
- Daftar Barang Ditemukan — Menampilkan barang-barang yang dilaporkan ditemukan oleh pengguna lain.
- Pencarian — Memudahkan pencarian barang hilang atau ditemukan berdasarkan kata kunci.
- Notifikasi — Pengguna mendapat notifikasi saat ada kecocokan antara laporan kehilangan dan barang yang ditemukan.
- Profil Pengguna — Setiap pengguna memiliki profil untuk mengelola laporan mereka.

### Teknologi yang Digunakan

#### Frontend

- React — Library JavaScript untuk membangun antarmuka pengguna interaktif.
- Vite — Build tool modern dengan performa cepat.

#### Backend

- NestJS — Framework Node.js progresif untuk aplikasi server yang efisien.
- PostgreSQL — Database relasional yang andal dan kuat.

### Instalasi

Pastikan sudah menginstal Node.js dan npm (atau yarn) sebelum memulai.

#### 1. Backend

1. Clone repository:
   ```bash
   git clone https://github.com/your-username/suka-kehilangan-backend.git
   cd suka-kehilangan-backend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env` di root folder:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
   ```
4. Jalankan migrasi database:
   ```bash
   npm run migrate
   ```
5. Jalankan server pengembangan:
   ```bash
   npm run start:dev
   ```
   Server tersedia di `http://localhost:3000`.

#### 2. Frontend

1. Clone repository:
   ```bash
   git clone https://github.com/your-username/suka-kehilangan-frontend.git
   cd suka-kehilangan-frontend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env` di root folder:
   ```bash
   VITE_API_URL=http://localhost:3000
   ```
4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
   Aplikasi tersedia di `http://localhost:5173`.

### Dokumentasi API

Dokumentasi API lengkap tersedia di file `API_DOCUMENTATION.md` dalam repository ini.

### Kontribusi

Kontribusi sangat terbuka!

- Buat _issue_ jika menemukan bug.
- Ajukan _pull request_ untuk fitur baru.

### Lisensi

Proyek ini menggunakan [MIT License](https://opensource.org/licenses/MIT).
