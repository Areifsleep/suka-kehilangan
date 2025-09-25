<div align="center">
  <a href="https://github.com/Areifsleep/suka-kehilangan">
    <img src="https://raw.githubusercontent.com/Areifsleep/suka-kehilangan/safeq/frontend/src/assets/UIN.png" alt="Logo UIN Sunan Kalijaga" width="150">
  </a>
  <h1 align="center">Suka Kehilangan</h1>
  <p align="center">
    Aplikasi Laporan Kehilangan Barang untuk Civitas Akademika UIN Sunan Kalijaga.
    <br />
    <a href="https://github.com/Areifsleep/suka-kehilangan/issues">Laporkan Bug</a>
    ·
    <a href="https://github.com/Areifsleep/suka-kehilangan/pulls">Ajukan Fitur Baru</a>
  </p>
</div>

<div align="center">

![React](https://img.shields.io/badge/React-v19-blue?logo=react&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-v11-red?logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-blue?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-v6-darkblue?logo=prisma&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-v7-purple?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-blue?logo=tailwindcss&logoColor=white)

</div>

---

## 📜 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Peran Pengguna](#-peran-pengguna-roles)
- [Tumpukan Teknologi](#-tumpukan-teknologi)
- [Instalasi](#-instalasi)
- [Tim Pengembang](#-tim-pengembang)
- [Lisensi](#-lisensi)

---

## 🚀 Tentang Proyek

**Suka Kehilangan** adalah aplikasi terpusat yang dikembangkan oleh **PT. Dark System** untuk **Universitas Islam Negeri Sunan Kalijaga**. Tujuan utamanya adalah menyediakan sistem yang efisien, aman, dan transparan untuk mengelola laporan kehilangan dan penemuan barang di lingkungan kampus.

Aplikasi ini dirancang untuk meningkatkan kualitas pelayanan, mendukung keamanan dan ketertiban, serta mempermudah seluruh proses pelaporan hingga barang kembali ke pemiliknya.

---

## ✨ Fitur Utama

Berikut adalah fitur utama yang tersedia untuk setiap peran:

### 👤 Pengguna

- **Pelaporan Kehilangan**: Mengisi formulir untuk melaporkan barang hilang, lengkap dengan opsi mengunggah bukti kepemilikan.
- **Pencarian Barang**: Mencari dan melihat daftar barang yang telah ditemukan oleh pihak lain.
- **Pelacakan Status**: Memantau status laporan kehilangan secara _real-time_.
- **Notifikasi Otomatis**: Menerima pemberitahuan jika ada barang ditemukan yang cocok dengan laporannya.

### 👮 Satpam & Administrator

- **Verifikasi Laporan**: Memverifikasi keabsahan laporan kehilangan dan barang yang ditemukan.
- **Dashboard Admin**: Halaman utama yang menampilkan ringkasan dan riwayat seluruh laporan.
- **Manajemen Data (CRUD)**: Melakukan proses _Create, Read, Update, Delete_ untuk data laporan dan pengguna.
- **Autentikasi Aman**: Sistem registrasi, login, dan reset kata sandi yang aman.
- **Versioning Dokumen**: Melacak riwayat perubahan pada setiap laporan untuk transparansi.

---

## 👥 Peran Pengguna (Roles)

Aplikasi ini memiliki tiga hak akses utama:

1.  **Pengguna (User)**: Mahasiswa, dosen, atau staf UIN Sunan Kalijaga yang dapat melaporkan kehilangan dan mencari barang.
2.  **Satpam (Security)**: Petugas keamanan yang bertugas mengelola, memverifikasi, dan melakukan serah terima barang.
3.  **Admin**: Pihak yang ditunjuk untuk melakukan monitoring sistem, audit, dan pengelolaan data secara keseluruhan.

---

## 🛠️ Tumpukan Teknologi

Aplikasi ini dibangun menggunakan tumpukan teknologi modern.

### Frontend

| Teknologi                                           | Versi   | Deskripsi                                              |
| --------------------------------------------------- | ------- | ------------------------------------------------------ |
| [React](https://react.dev/)                         | `~19.1` | Pustaka JavaScript untuk membangun antarmuka pengguna. |
| [Vite](https://vitejs.dev/)                         | `~7.1`  | _Build tool_ modern untuk pengembangan frontend.       |
| [Tailwind CSS](https://tailwindcss.com/)            | `~4.1`  | Kerangka kerja CSS untuk desain yang cepat dan modern. |
| [TanStack Query](https://tanstack.com/query/latest) | `~5.90` | Manajemen _state_ asinkron yang kuat.                  |
| [React Router](https://reactrouter.com/)            | `~7.9`  | Navigasi dan _routing_ untuk aplikasi React.           |

### Backend

| Teknologi                                      | Versi    | Deskripsi                                                       |
| ---------------------------------------------- | -------- | --------------------------------------------------------------- |
| [Nest.js](https://nestjs.com/)                 | `~11.0`  | Kerangka kerja Node.js untuk aplikasi sisi server yang efisien. |
| [Prisma](https://www.prisma.io/)               | `~6.16`  | ORM modern untuk interaksi dengan database.                     |
| [PostgreSQL](https://www.postgresql.org/)      | `latest` | Sistem manajemen database relasional yang andal.                |
| [JWT](https://jwt.io/)                         | `~11.0`  | Otentikasi pengguna berbasis token yang aman.                   |
| [Argon2](https://en.wikipedia.org/wiki/Argon2) | `~0.44`  | Algoritma _hashing_ kata sandi yang kuat.                       |

---

## ⚙️ Instalasi

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut.

### Prasyarat

- [Node.js](https://nodejs.org/en) (v22.x atau lebih tinggi)
- [pnpm](https://pnpm.io/installation) (opsional, namun direkomendasikan)
- [PostgreSQL](https://www.postgresql.org/download/)

<details>
<summary><strong>🖥️ Backend Setup</strong></summary>

1.  **Clone Repository**
    ```sh
    git clone https://github.com/Areifsleep/suka-kehilangan.git
    cd suka-kehilangan/backend
    ```
2.  **Instal Dependensi**
    ```sh
    npm install
    ```
3.  **Konfigurasi Lingkungan**
    Buat file `.env` dari contoh yang ada dan sesuaikan dengan konfigurasi database Anda.
    ```sh
    cp .env.example .env
    ```
    Isi `DATABASE_URL` dalam file `.env`:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```
4.  **Jalankan Migrasi Database**
    Perintah ini akan membuat skema database sesuai dengan model Prisma.
    ```sh
    npx prisma migrate dev
    ```
5.  **Jalankan Server**
    ```sh
    npm run start:dev
    ```
    Server akan berjalan di `http://localhost:3000`.

</details>

<details>
<summary><strong>🌐 Frontend Setup</strong></summary>

1.  **Pindah ke Direktori Frontend**
    ```sh
    cd ../frontend
    ```
2.  **Instal Dependensi**
    ```sh
    npm install
    ```
3.  **Konfigurasi Lingkungan**
    Buat file `.env.local` dan arahkan ke alamat API backend.
    ```env
    VITE_API_URL=http://localhost:3000
    ```
4.  **Jalankan Aplikasi**
    ```sh
    npm run dev
    ```
    Aplikasi akan tersedia di `http://localhost:5173`.

</details>

---

## 👨‍💻 Tim Pengembang (PT. Dark System)

Proyek ini dikembangkan oleh tim mahasiswa Teknik Informatika UIN Sunan Kalijaga.

| NIM           | Nama                |
| ------------- | ------------------- |
| `23106050050` | Arif Rahman         |
| `23106050077` | Ahmad Zidni Hidayat |
| `23106050084` | Rozin Gunagraha     |
| `23106050094` | Syafiq Rustiawanto  |

---

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.
