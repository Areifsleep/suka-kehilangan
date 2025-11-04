# Software Requirements Specification
# Sistem Aplikasi "Suka Kehilangan"
# Platform Pelaporan Barang Hilang UIN Sunan Kalijaga Yogyakarta

**Version 1.0 approved**

**Prepared by:**
- <NIM 1 - Nama>
- <NIM 2 - Nama>
- <NIM 3 - Nama>
- <NIM 4 - Nama>

**Date Created:** <date created>

---

## Revision History

| Name | Date | Reason For Changes | Version |
|------|------|-------------------|---------|
|      |      |                   |         |

---

## Table of Contents

1. [Pendahuluan](#1-pendahuluan)
   - 1.1 [Tujuan Penulisan Dokumen](#11-tujuan-penulisan-dokumen)
   - 1.2 [Audien yang Dituju dan Pembaca yang Disarankan](#12-audien-yang-dituju-dan-pembaca-yang-disarankan)
   - 1.3 [Batasan Produk](#13-batasan-produk)
   - 1.4 [Definisi dan Istilah](#14-definisi-dan-istilah)
   - 1.5 [Referensi](#15-referensi)
2. [Deskripsi Keseluruhan](#2-deskripsi-keseluruhan)
   - 2.1 [Deskripsi Produk](#21-deskripsi-produk)
   - 2.2 [Fungsi Produk](#22-fungsi-produk)
   - 2.3 [Penggolongan Karakteristik Pengguna](#23-penggolongan-karakteristik-pengguna)
   - 2.4 [Lingkungan Operasi](#24-lingkungan-operasi)
   - 2.5 [Batasan Desain dan Implementasi](#25-batasan-desain-dan-implementasi)
   - 2.6 [Dokumentasi Pengguna](#26-dokumentasi-pengguna)
3. [Kebutuhan Antarmuka Eksternal](#3-kebutuhan-antarmuka-eksternal)
   - 3.1 [User Interfaces](#31-user-interfaces)
   - 3.2 [Hardware Interface](#32-hardware-interface)
   - 3.3 [Software Interface](#33-software-interface)
   - 3.4 [Communication Interface](#34-communication-interface)
4. [Functional Requirement](#4-functional-requirement)
   - 4.1 [Use Case Diagram](#41-use-case-diagram)
   - 4.2 [Use Case: Registrasi dan Login](#42-use-case-registrasi-dan-login)
   - 4.3 [Use Case: Melaporkan Barang Hilang](#43-use-case-melaporkan-barang-hilang)
   - 4.4 [Use Case: Melaporkan Barang Temuan](#44-use-case-melaporkan-barang-temuan)
   - 4.5 [Use Case: Pencarian Barang](#45-use-case-pencarian-barang)
   - 4.6 [Use Case: Notifikasi dan Pencocokan](#46-use-case-notifikasi-dan-pencocokan)
   - 4.7 [Use Case: Mengelola Laporan (Admin)](#47-use-case-mengelola-laporan-admin)
   - 4.8 [Class Diagram](#48-class-diagram)
5. [Non Functional Requirements](#5-non-functional-requirements)

---

# 1. Pendahuluan

## 1.1 Tujuan Penulisan Dokumen

Dokumen ini merupakan Spesifikasi Kebutuhan Perangkat Lunak (SKPL) atau Software Requirement Specification (SRS) untuk Sistem Aplikasi "Suka Kehilangan". Tujuan dari penulisan dokumen ini adalah untuk memberikan penjelasan mengenai perangkat lunak yang akan dibangun baik berupa gambaran umum maupun penjelasan detail dan menyeluruh.

Pengguna dari dokumen ini adalah para developer perangkat lunak Sistem "Suka Kehilangan" dan pengguna akhir dari perangkat lunak ini yaitu civitas akademika UIN Sunan Kalijaga Yogyakarta serta pihak-pihak yang terlibat dalam pengembangan sistem.

Dokumen ini digunakan sebagai bahan acuan dalam proses pengembangan perangkat lunak. Adanya dokumen SRS ini diharapkan akan membantu pengembang dalam mengembangkan perangkat lunak secara terarah dan terfokus sesuai kebutuhan dan persyaratan awal sekaligus menghindari munculnya ambiguitas dalam proses pengembangan perangkat lunak.

## 1.2 Audien yang Dituju dan Pembaca yang Disarankan

Dokumen ini memuat informasi umum mengenai Sistem "Suka Kehilangan" yaitu terkait fitur, desain, fungsionalitas, dan persyaratan sistem. Dokumen dibagi ke dalam beberapa bagian agar pembaca lebih mudah untuk mengerti:

- **Bagian 1** membahas mengenai pendahuluan dan tujuan dokumen dari perangkat lunak ini
- **Bagian 2** membahas mengenai deskripsi keseluruhan sistem dari perangkat lunak ini
- **Bagian 3** membahas mengenai kebutuhan antarmuka eksternal seperti antarmuka pengguna, perangkat keras, perangkat lunak, dan komunikasi
- **Bagian 4** membahas mengenai persyaratan fungsional sistem dari perangkat lunak ini
- **Bagian 5** membahas mengenai persyaratan non fungsional sistem dari perangkat lunak ini

Dokumen ini penting untuk diperhatikan dan digunakan oleh:

- **Pengembang**: untuk memastikan bahwa mereka telah mengembangkan perangkat lunak ini dengan benar sesuai spesifikasi, dan dapat mendasari perbaikan fitur software di kemudian hari
- **Pengguna**: untuk memperoleh kejelasan mengenai ide proyek dan mereview pengembangan perangkat lunak yang dibutuhkan
- **Penguji**: untuk mendapatkan informasi pengujian terhadap fitur-fitur yang akan dikembangkan dan disesuaikan dengan kebutuhan pengguna
- **Stakeholder**: pihak Universitas Islam Negeri Sunan Kalijaga Yogyakarta untuk memahami sistem yang akan diimplementasikan

## 1.3 Batasan Produk

Aplikasi "Suka Kehilangan" adalah platform web berbasis komunitas yang dirancang khusus untuk memfasilitasi pelaporan dan penemuan barang hilang di lingkungan Universitas Islam Negeri Sunan Kalijaga Yogyakarta. Aplikasi ini bertujuan untuk mengatasi ketidakefisienan dalam proses pencarian barang hilang yang selama ini mengandalkan media sosial atau pengumuman manual yang memiliki jangkauan terbatas.

Manfaat utama dari aplikasi ini adalah:
- Menyediakan platform terpusat untuk pelaporan barang hilang dan temuan
- Mempercepat proses pencocokan antara pemilik barang dan penemu
- Meningkatkan peluang barang hilang kembali kepada pemiliknya
- Mengurangi kepanikan dan kerugian akibat kehilangan barang
- Membangun budaya saling membantu di lingkungan kampus

Aplikasi ini mendukung strategi Universitas dalam menciptakan lingkungan kampus yang aman, tertib, dan peduli terhadap sesama anggota civitas akademika.

## 1.4 Definisi dan Istilah

- **SRS**: Software Requirements Specification, atau Spesifikasi Kebutuhan Perangkat Lunak (SKPL)
- **IEEE**: Institute of Electrical and Electronics Engineering, standar internasional untuk pengembangan dan perancangan produk
- **User**: Pengguna aplikasi, yaitu civitas akademika UIN Sunan Kalijaga Yogyakarta (mahasiswa, dosen, dan staff)
- **Admin**: Administrator sistem yang mengelola dan mengawasi seluruh laporan dalam aplikasi
- **Pelapor Kehilangan**: User yang melaporkan barang yang hilang
- **Pelapor Penemuan**: User yang melaporkan barang yang ditemukan
- **Laporan**: Entri data mengenai barang hilang atau barang temuan yang diinput oleh user
- **Notifikasi**: Pemberitahuan otomatis yang dikirim kepada user ketika terdapat kemungkinan pencocokan barang
- **Kategori Barang**: Pengelompokan jenis barang (elektronik, dokumen, aksesoris, dll.)
- **Status Laporan**: Kondisi terkini dari laporan (aktif, ditemukan, atau closed)

## 1.5 Referensi

- IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications
- Dokumen latar belakang proyek "Suka Kehilangan"
- Kebijakan dan regulasi UIN Sunan Kalijaga Yogyakarta terkait pengelolaan barang hilang

---

# 2. Deskripsi Keseluruhan

## 2.1 Deskripsi Produk

"Suka Kehilangan" adalah aplikasi web platform yang dirancang sebagai solusi modern untuk mengatasi masalah kehilangan barang di lingkungan Universitas Islam Negeri Sunan Kalijaga Yogyakarta. Aplikasi ini menyediakan wadah terpusat bagi civitas akademika untuk melaporkan barang yang hilang maupun barang yang ditemukan.

Sistem ini menghubungkan dua pihak utama: individu yang kehilangan barang dan individu yang menemukan barang. Melalui fitur pencarian, kategorisasi yang jelas, dan sistem notifikasi otomatis, aplikasi ini memfasilitasi proses pencocokan informasi secara efisien. User dapat mengunggah foto, deskripsi detail, lokasi, dan waktu kehilangan atau penemuan barang.

Aplikasi ini dirancang dengan antarmuka yang user-friendly dan dapat diakses melalui berbagai perangkat (desktop, tablet, smartphone) untuk memastikan kemudahan akses bagi seluruh civitas akademika.

## 2.2 Fungsi Produk

Fungsi utama aplikasi "Suka Kehilangan" meliputi:

- Memungkinkan pengguna untuk mendaftar dan login ke sistem dengan menggunakan email institusi UIN Sunan Kalijaga
- Memfasilitasi pelaporan barang hilang dengan informasi detail seperti nama barang, kategori, deskripsi, foto, lokasi, dan waktu kehilangan
- Memfasilitasi pelaporan barang temuan dengan informasi detail seperti nama barang, kategori, deskripsi, foto, lokasi, dan waktu penemuan
- Menyediakan fitur pencarian dan filter berdasarkan kategori barang, lokasi, dan rentang waktu
- Mengirimkan notifikasi otomatis kepada pengguna ketika terdapat kemungkinan pencocokan antara laporan kehilangan dan laporan penemuan
- Memungkinkan komunikasi antara pelapor kehilangan dan pelapor penemuan untuk verifikasi kepemilikan
- Menyediakan dashboard untuk admin untuk mengelola, memverifikasi, dan mengawasi seluruh laporan
- Memungkinkan pengguna untuk mengubah status laporan (ditemukan/closed) setelah barang berhasil dikembalikan
- Menampilkan riwayat laporan untuk setiap pengguna
- Menyediakan statistik dan laporan untuk admin mengenai barang yang hilang dan ditemukan

## 2.3 Penggolongan Karakteristik Pengguna

| Kategori Pengguna | Tugas | Hak Akses ke Aplikasi | Kemampuan yang Harus Dimiliki |
|-------------------|-------|----------------------|-------------------------------|
| **Civitas Akademika (User Umum)** | - Melaporkan barang hilang<br>- Melaporkan barang temuan<br>- Mencari informasi barang<br>- Melihat detail laporan<br>- Menghubungi pelapor lain<br>- Mengubah status laporan sendiri | - Create laporan<br>- Read semua laporan publik<br>- Update laporan sendiri<br>- Delete laporan sendiri | - Kemampuan menggunakan browser web<br>- Kemampuan mengunggah foto<br>- Kemampuan menulis deskripsi barang<br>- Memiliki email institusi UIN Sunan Kalijaga |
| **Administrator** | - Mengelola semua laporan<br>- Memverifikasi laporan<br>- Menghapus laporan yang tidak sesuai<br>- Mengelola user<br>- Melihat statistik sistem<br>- Mengirim pengumuman | - Full access (CRUD) terhadap semua laporan<br>- Mengelola user<br>- Akses dashboard admin<br>- Generate report | - Kemampuan moderasi konten<br>- Pemahaman kebijakan kampus<br>- Kemampuan analisis data<br>- Kemampuan pengelolaan sistem |

## 2.4 Lingkungan Operasi

Aplikasi "Suka Kehilangan" akan beroperasi dalam lingkungan sebagai berikut:

**Platform**: Web-based application yang dapat diakses melalui web browser

**Client-side**:
- Web browser modern (Google Chrome versi 90+, Mozilla Firefox versi 88+, Safari versi 14+, Microsoft Edge versi 90+)
- Perangkat: Desktop, Laptop, Tablet, dan Smartphone
- Koneksi internet dengan bandwidth minimum 1 Mbps

**Server-side**:
- Web Server: Apache/Nginx
- Application Server: Node.js atau PHP 7.4+
- Database Server: MySQL 8.0+ atau PostgreSQL 12+
- Operating System: Linux (Ubuntu 20.04 LTS atau CentOS 8)
- Hosting: Cloud hosting atau server lokal kampus

**Komponen Pendukung**:
- Storage untuk penyimpanan foto (Cloud Storage atau Local Storage)
- Email service untuk notifikasi (SMTP server kampus atau layanan email third-party)
- SSL/TLS certificate untuk keamanan koneksi HTTPS

## 2.5 Batasan Desain dan Implementasi

Dalam pengembangan aplikasi "Suka Kehilangan", terdapat beberapa batasan yang perlu diperhatikan:

**Kebijakan dan Regulasi**:
- Aplikasi harus mematuhi kebijakan privasi dan perlindungan data UIN Sunan Kalijaga
- Hanya pengguna dengan email institusi (@uin-suka.ac.id) yang dapat mengakses sistem
- Konten yang dilaporkan harus sesuai dengan nilai-nilai dan etika kampus

**Keterbatasan Teknis**:
- Ukuran maksimal foto yang dapat diunggah: 5 MB per file
- Format foto yang didukung: JPG, JPEG, PNG
- Maksimal 5 foto per laporan
- Response time maksimal 3 detik untuk operasi standar

**Teknologi dan Tools**:
- Framework front-end: React.js atau Vue.js
- Framework back-end: Express.js (Node.js) atau Laravel (PHP)
- Database: MySQL atau PostgreSQL
- Responsive design menggunakan Bootstrap atau Tailwind CSS

**Keamanan**:
- Implementasi HTTPS untuk semua komunikasi
- Enkripsi password menggunakan bcrypt atau algoritma hashing yang aman
- Validasi dan sanitasi input untuk mencegah SQL Injection dan XSS
- Rate limiting untuk mencegah spam dan abuse

**Standar Pemrograman**:
- Kode harus mengikuti best practices dan coding standards
- Dokumentasi kode harus lengkap dan jelas
- Version control menggunakan Git

## 2.6 Dokumentasi Pengguna

Dokumentasi yang akan disediakan bersama dengan aplikasi "Suka Kehilangan":

1. **User Manual (Panduan Pengguna)**
   - Panduan lengkap cara menggunakan aplikasi
   - Step-by-step untuk melaporkan barang hilang dan temuan
   - Panduan pencarian dan filtering
   - Cara berkomunikasi dengan user lain
   - FAQ (Frequently Asked Questions)

2. **Quick Start Guide**
   - Panduan singkat untuk memulai menggunakan aplikasi
   - Flowchart proses pelaporan
   - Tips efektif melaporkan barang

3. **Online Help (In-app Help)**
   - Tooltip pada setiap form input
   - Help icon yang dapat diklik untuk penjelasan fitur
   - Tutorial video singkat untuk fitur-fitur utama

4. **Administrator Guide**
   - Panduan pengelolaan sistem untuk admin
   - Cara moderasi laporan
   - Panduan penggunaan dashboard admin
   - Panduan generate report dan statistik

5. **Technical Documentation**
   - API Documentation
   - Database schema
   - System architecture
   - Deployment guide

---

# 3. Kebutuhan Antarmuka Eksternal

## 3.1 User Interfaces

Antarmuka pengguna aplikasi "Suka Kehilangan" dirancang dengan prinsip user-friendly, intuitif, dan responsive. Berikut adalah karakteristik antarmuka untuk setiap komponen:

**Halaman Utama (Landing Page)**:
- Header dengan logo UIN Sunan Kalijaga dan nama aplikasi
- Navigation bar: Home, Laporan Hilang, Laporan Temuan, Cari, Login/Register
- Hero section dengan call-to-action untuk melaporkan barang
- Daftar laporan terbaru dalam bentuk card dengan thumbnail foto
- Search bar yang prominent di bagian atas
- Footer dengan informasi kontak dan link penting

**Halaman Login/Register**:
- Form sederhana dengan field email institusi dan password
- Validasi real-time untuk input
- Link untuk lupa password
- Pesan error yang jelas dan membantu

**Dashboard User**:
- Sidebar menu: Dashboard, Laporan Saya, Buat Laporan, Cari Barang, Notifikasi, Profil
- Area konten utama yang menampilkan ringkasan laporan user
- Badge notifikasi untuk update terbaru
- Quick action buttons untuk membuat laporan baru

**Form Pelaporan**:
- Layout yang clean dengan field yang terorganisir
- Upload area untuk foto dengan drag-and-drop support
- Dropdown untuk kategori barang
- Date picker untuk tanggal kejadian
- Text area untuk deskripsi
- Button "Submit" yang prominent

**Halaman Detail Laporan**:
- Gallery foto yang dapat diperbesar
- Informasi detail barang dalam format yang mudah dibaca
- Tombol "Hubungi Pelapor" dengan modal popup form kontak
- Peta lokasi (jika tersedia)
- Timestamp dan status laporan

**Dashboard Admin**:
- Tabel dengan fitur sorting dan filtering
- Action buttons untuk approve, edit, delete
- Statistik dashboard dengan chart
- Search function yang powerful

**Standar Desain**:
- Warna utama menggunakan palet warna identitas UIN Sunan Kalijaga
- Font yang mudah dibaca (seperti Inter, Roboto, atau Open Sans)
- Icon set yang konsisten (menggunakan Font Awesome atau Material Icons)
- Button dengan feedback visual (hover, active states)
- Loading indicators untuk operasi yang memerlukan waktu
- Error messages yang informatif dan helpful
- Success notifications yang jelas

**Keyboard Shortcuts**:
- Ctrl + K untuk quick search
- Esc untuk close modal
- Tab navigation yang logis

## 3.2 Hardware Interface

Aplikasi "Suka Kehilangan" adalah aplikasi berbasis web yang tidak memerlukan antarmuka perangkat keras khusus. Namun, aplikasi ini dirancang untuk dapat mengakses hardware berikut melalui web browser:

**Kamera (Camera Access)**:
- Aplikasi dapat mengakses kamera perangkat untuk pengambilan foto barang secara langsung melalui browser
- Digunakan saat user ingin mengunggah foto barang hilang atau temuan
- Permission request akan muncul sesuai standar browser security

**GPS/Location Services**:
- Aplikasi dapat mengakses layanan lokasi perangkat untuk menandai lokasi kehilangan atau penemuan barang (optional)
- Berguna untuk memberikan konteks geografis pada laporan
- Permission request akan mengikuti standar browser

**Storage (File System)**:
- Akses ke file system lokal untuk upload foto dari galeri atau folder
- Browser-based file picker untuk memilih foto

**Tidak Ada Persyaratan Hardware Khusus**:
- Tidak memerlukan scanner, barcode reader, atau perangkat khusus lainnya
- Dapat berjalan pada perangkat dengan spesifikasi standar (smartphone, tablet, laptop, desktop)

## 3.3 Software Interface

**Database System**:
- Nama: MySQL
- Versi: 8.0 atau lebih tinggi
- Fungsi: Menyimpan data user, laporan barang hilang, laporan barang temuan, notifikasi, dan log sistem
- Data yang dibagikan: Semua data aplikasi tersimpan dalam database relasional dengan foreign key relationships

**Web Server**:
- Nama: Apache HTTP Server atau Nginx
- Versi: Apache 2.4+ atau Nginx 1.18+
- Fungsi: Melayani request HTTP/HTTPS dan hosting aplikasi web

**Application Framework**:
- Back-end: Node.js dengan Express.js atau PHP dengan Laravel
- Front-end: React.js atau Vue.js
- Fungsi: Mengelola business logic, routing, dan rendering interface

**Email Service**:
- Protocol: SMTP
- Fungsi: Mengirim notifikasi email kepada user
- Data: Subject, body, dan recipient email address
- Dapat menggunakan SMTP server kampus atau third-party service (SendGrid, Mailgun)

**Cloud Storage (Optional)**:
- Layanan: AWS S3, Google Cloud Storage, atau local file storage
- Fungsi: Menyimpan file foto yang diunggah user
- Data: Image files dalam format JPG, JPEG, PNG

**Operating System**:
- Server: Linux (Ubuntu 20.04 LTS atau CentOS 8)
- Client: Any OS yang mendukung modern web browser (Windows, macOS, Linux, Android, iOS)

**API Integration**:
- RESTful API untuk komunikasi antara front-end dan back-end
- JSON format untuk data exchange
- Authentication menggunakan JWT (JSON Web Tokens) atau session-based auth

**Browser Compatibility**:
- Google Chrome 90+
- Mozilla Firefox 88+
- Safari 14+
- Microsoft Edge 90+

## 3.4 Communication Interface

**HTTP/HTTPS Protocol**:
- Semua komunikasi antara client dan server menggunakan HTTPS (SSL/TLS encryption)
- Port 443 untuk HTTPS
- RESTful API architecture untuk request/response

**API Endpoints**:
- Format data: JSON
- Authentication: Bearer token (JWT) dalam header request
- Request methods: GET, POST, PUT, DELETE
- Response codes: 200 (Success), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)

**Email Communication**:
- Protocol: SMTP/SMTPS
- Port: 587 (TLS) atau 465 (SSL)
- Fungsi: Mengirim email notifikasi dan email verifikasi
- Format: HTML email dengan template yang responsive

**Real-time Notifications (Optional)**:
- WebSocket atau Server-Sent Events (SSE) untuk notifikasi real-time
- Digunakan untuk push notification ketika ada pencocokan laporan

**Data Transfer**:
- File upload menggunakan multipart/form-data
- Maximum payload size: 10 MB per request
- Compression: Gzip compression untuk response data
- Rate limiting: Maximum 100 requests per minute per user untuk mencegah abuse

**Security**:
- TLS 1.2 atau lebih tinggi untuk enkripsi komunikasi
- CORS (Cross-Origin Resource Sharing) configuration untuk keamanan API
- CSRF (Cross-Site Request Forgery) protection
- Input validation dan sanitization di server-side

**Data Synchronization**:
- Automatic sync setiap kali user melakukan refresh atau action
- Optimistic UI updates untuk better user experience
- Conflict resolution untuk concurrent updates

---

# 4. Functional Requirement

Berikut adalah daftar kebutuhan fungsional aplikasi "Suka Kehilangan":

| ID | Kebutuhan Fungsional | Penjelasan |
|----|---------------------|------------|
| FR-001 | Registrasi User | Sistem harus memungkinkan civitas akademika untuk mendaftar menggunakan email institusi UIN Sunan Kalijaga (@uin-suka.ac.id) |
| FR-002 | Login dan Autentikasi | Sistem harus memungkinkan user untuk login dengan email dan password, serta menyimpan session |
| FR-003 | Manajemen Profil | User dapat mengelola profil mereka termasuk nama, nomor telepon, dan foto profil |
| FR-004 | Melaporkan Barang Hilang | User dapat membuat laporan barang hilang dengan mengisi form yang berisi nama barang, kategori, deskripsi, foto, lokasi, tanggal kehilangan, dan informasi kontak |
| FR-005 | Melaporkan Barang Temuan | User dapat membuat laporan barang temuan dengan mengisi form yang berisi nama barang, kategori, deskripsi, foto, lokasi, tanggal penemuan, dan informasi kontak |
| FR-006 | Upload Foto | Sistem harus memungkinkan user untuk mengunggah maksimal 5 foto per laporan dengan ukuran maksimal 5 MB per foto |
| FR-007 | Kategorisasi Barang | Sistem menyediakan kategori barang (Elektronik, Dokumen, Aksesoris, Pakaian, Kunci, Alat Tulis, Lainnya) untuk memudahkan pencarian |
| FR-008 | Pencarian Laporan | User dapat mencari laporan berdasarkan keyword, kategori, lokasi, dan rentang tanggal |
| FR-009 | Filter dan Sorting | Sistem menyediakan filter untuk kategori, lokasi, status, dan sorting berdasarkan tanggal (terbaru/terlama) |
| FR-010 | Melihat Detail Laporan | User dapat melihat informasi detail dari setiap laporan termasuk foto, deskripsi lengkap, dan informasi pelapor |
| FR-011 | Sistem Notifikasi | Sistem secara otomatis mengirim notifikasi kepada user ketika terdapat kemungkinan pencocokan antara laporan kehilangan dan laporan temuan berdasarkan kategori, deskripsi, dan waktu |
| FR-012 | Komunikasi Antar User | Sistem menyediakan fitur untuk menghubungi pelapor lain melalui form kontak atau menampilkan informasi kontak yang telah diberikan |
| FR-013 | Update Status Laporan | User dapat mengubah status laporan mereka menjadi "Ditemukan" atau "Closed" setelah barang berhasil dikembalikan |
| FR-014 | Edit Laporan | User dapat mengedit laporan yang telah mereka buat |
| FR-015 | Hapus Laporan | User dapat menghapus laporan yang telah mereka buat |
| FR-016 | Riwayat Laporan | Sistem menampilkan riwayat semua laporan yang pernah dibuat oleh user |
| FR-017 | Dashboard Admin | Admin memiliki dashboard khusus untuk mengelola semua laporan, user, dan statistik sistem |
| FR-018 | Verifikasi Laporan | Admin dapat memverifikasi, menyetujui, atau menolak laporan yang dibuat oleh user |
| FR-019 | Moderasi Konten | Admin dapat menghapus atau mengedit laporan yang tidak sesuai dengan kebijakan |
| FR-020 | Manajemen User | Admin dapat melihat daftar user, menonaktifkan akun, atau menghapus user yang melanggar |
| FR-021 | Statistik dan Laporan | Sistem menyediakan statistik untuk admin berupa jumlah barang hilang, barang ditemukan, tingkat keberhasilan, dan tren per kategori |
| FR-022 | Email Notifikasi | Sistem mengirim email notifikasi kepada user untuk update penting (pencocokan laporan, perubahan status, dll) |
| FR-023 | Forgot Password | User dapat melakukan reset password melalui email verifikasi |
| FR-024 | Logout | User dapat logout dari sistem dan menghapus session |

## 4.1 Use Case Diagram

```
                          +------------------+
                          |  Civitas UIN SK  |
                          |     (User)       |
                          +------------------+
                                   |
                 +-----------------+-----------------+
                 |                 |                 |
                 v                 v                 v
          [Register &       [Laporkan         [Laporkan
           Login]            Barang Hilang]    Barang Temuan]
                 |                 |                 |
                 |                 v                 |
                 |          [Upload Foto]            |
                 |                 |                 |
                 +--------+--------+--------+--------+
                          |                 |
                          v                 v
                    [Cari Barang]    [Lihat Detail
                          |           Laporan]
                          v                 |
                   [Filter & Sort]          v
                                     [Hubungi Pelapor]
                          |                 |
                          +--------+--------+
                                   |
                                   v
                           [Terima Notifikasi]
                                   |
                                   v
                          [Update Status Laporan]
                                   |
                                   v
                          [Edit/Hapus Laporan]


                          +------------------+
                          |  Administrator   |
                          +------------------+
                                   |
                 +-----------------+-----------------+
                 |                 |                 |
                 v                 v                 v
          [Kelola Laporan]  [Verifikasi       [Kelola User]
                             Laporan]
                 |                 |                 |
                 |                 v                 |
                 |          [Moderasi Konten]        |
                 |                                   |
                 +------------------+----------------+
                                    |
                                    v
                           [Lihat Statistik &
                            Generate Report]


                          +------------------+
                          |  Email System    |
                          |    (External)    |
                          +------------------+
                                   ^
                                   |
                          [Kirim Notifikasi Email]
```

## 4.2 Use Case: Registrasi dan Login

### 4.2.1 Deskripsi Use Case

Use case ini menggambarkan proses pendaftaran user baru dan proses login ke dalam sistem "Suka Kehilangan". User harus menggunakan email institusi UIN Sunan Kalijaga untuk dapat mendaftar. Setelah registrasi berhasil, user dapat login menggunakan kredensial yang telah dibuat.

### 4.2.2 Stimulus and Response

| Action by User | Response from System |
|---------------|---------------------|
| 1. User mengakses halaman registrasi | |
| | 2. Sistem menampilkan form registrasi dengan field: nama lengkap, email institusi, nomor telepon, password, dan konfirmasi password |
| 3. User mengisi form dan menekan tombol "Daftar" | |
| | 4. Sistem memvalidasi input, memeriksa apakah email menggunakan domain @uin-suka.ac.id, dan memeriksa apakah email sudah terdaftar |
| | 5. Jika validasi berhasil, sistem membuat akun baru dan mengirim email verifikasi |
| | 6. Sistem menampilkan pesan sukses dan mengarahkan ke halaman login |
| 7. User mengklik link verifikasi di email | |
| | 8. Sistem mengaktifkan akun dan menampilkan konfirmasi |
| 9. User memasukkan email dan password di halaman login, lalu klik "Login" | |
| | 10. Sistem memverifikasi kredensial |
| | 11. Jika valid, sistem membuat session dan mengarahkan user ke dashboard |

### 4.2.3 Activity Diagram

```
[Start] → [User Akses Halaman Registrasi] → [Tampilkan Form Registrasi]
    → [User Isi Form] → [Validasi Input]
    → {Email Valid?}
        → [Yes] → {Email Belum Terdaftar?}
            → [Yes] → [Buat Akun Baru] → [Kirim Email Verifikasi]
                → [Tampilkan Pesan Sukses] → [User Klik Link Verifikasi]
                → [Aktivasi Akun] → [User Login] → [Verifikasi Kredensial]
                → {Kredensial Valid?}
                    → [Yes] → [Buat Session] → [Redirect ke Dashboard] → [End]
                    → [No] → [Tampilkan Error] → [End]
            → [No] → [Tampilkan Error: Email Sudah Terdaftar] → [End]
        → [No] → [Tampilkan Error: Email Harus @uin-suka.ac.id] → [End]
```

## 4.3 Use Case: Melaporkan Barang Hilang

### 4.3.1 Deskripsi Use Case

Use case ini menjelaskan proses user melaporkan barang yang hilang ke dalam sistem. User mengisi formulir dengan detail barang yang hilang termasuk nama barang, kategori, deskripsi, foto, lokasi kehilangan, dan waktu kehilangan. Sistem akan menyimpan laporan dan mengirim notifikasi jika ada kemungkinan pencocokan dengan barang temuan.

### 4.3.2 Stimulus and Response

| Action by User | Response from System |
|---------------|---------------------|
| 1. User login dan memilih menu "Laporkan Barang Hilang" | |
| | 2. Sistem menampilkan form laporan dengan field: nama barang, kategori (dropdown), deskripsi, lokasi, tanggal kehilangan, nomor kontak, dan area upload foto |
| 3. User mengisi semua field yang diperlukan | |
| | 4. Sistem melakukan validasi real-time untuk setiap field |
| 5. User mengunggah foto barang (1-5 foto) | |
| | 6. Sistem memvalidasi format dan ukuran file, menampilkan preview foto |
| 7. User menekan tombol "Submit Laporan" | |
| | 8. Sistem memeriksa kelengkapan data |
| | 9. Sistem menyimpan laporan ke database dengan status "Aktif" |
| | 10. Sistem melakukan pencocokan otomatis dengan laporan barang temuan yang ada |
| | 11. Jika ditemukan kemungkinan pencocokan, sistem mengirim notifikasi kepada user dan penemu |
| | 12. Sistem menampilkan pesan sukses dan mengarahkan ke halaman detail laporan |

### 4.3.3 Activity Diagram

```
[Start] → [User Login] → [Pilih Menu Laporkan Barang Hilang]
    → [Tampilkan Form Laporan] → [User Isi Form]
    → [Validasi Input] → {Input Valid?}
        → [No] → [Tampilkan Error Message] → [User Perbaiki Input]
        → [Yes] → [User Upload Foto] → [Validasi Foto]
            → {Foto Valid?}
                → [No] → [Tampilkan Error Foto] → [User Upload Ulang]
                → [Yes] → [User Submit Laporan] → [Simpan ke Database]
                    → [Set Status: Aktif] → [Proses Pencocokan Otomatis]
                    → {Ada Kemungkinan Match?}
                        → [Yes] → [Kirim Notifikasi ke User & Penemu]
                        → [No] → [Lanjut]
                    → [Tampilkan Pesan Sukses] → [Redirect ke Detail Laporan] → [End]
```

## 4.4 Use Case: Melaporkan Barang Temuan

### 4.4.1 Deskripsi Use Case

Use case ini menjelaskan proses user melaporkan barang yang ditemukan. User mengisi formulir dengan detail barang temuan termasuk nama barang, kategori, deskripsi, foto, lokasi penemuan, dan waktu penemuan. Sistem akan menyimpan laporan dan secara otomatis mencocokkan dengan laporan barang hilang yang ada.

### 4.4.2 Stimulus and Response

| Action by User | Response from System |
|---------------|---------------------|
| 1. User login dan memilih menu "Laporkan Barang Temuan" | |
| | 2. Sistem menampilkan form laporan dengan field: nama barang, kategori (dropdown), deskripsi, lokasi penemuan, tanggal penemuan, kondisi barang, nomor kontak, dan area upload foto |
| 3. User mengisi semua field yang diperlukan dan mengunggah foto | |
| | 4. Sistem melakukan validasi real-time |
| 5. User menekan tombol "Submit Laporan" | |
| | 6. Sistem menyimpan laporan ke database dengan status "Tersedia" |
| | 7. Sistem melakukan pencocokan otomatis dengan laporan barang hilang berdasarkan kategori, deskripsi, dan rentang waktu |
| | 8. Jika ditemukan kemungkinan pencocokan, sistem mengirim notifikasi kepada pemilik barang yang hilang dan penemu |
| | 9. Sistem menampilkan pesan sukses dan daftar kemungkinan pemilik (jika ada) |

### 4.4.3 Activity Diagram

```
[Start] → [User Login] → [Pilih Menu Laporkan Barang Temuan]
    → [Tampilkan Form Laporan] → [User Isi Form & Upload Foto]
    → [Validasi Input] → {Input Valid?}
        → [No] → [Tampilkan Error] → [User Perbaiki]
        → [Yes] → [Submit Laporan] → [Simpan ke Database]
            → [Set Status: Tersedia] → [Proses Pencocokan dengan Laporan Hilang]
            → {Ada Kemungkinan Match?}
                → [Yes] → [Generate List Kemungkinan Pemilik]
                    → [Kirim Notifikasi ke Pemilik & Penemu]
                    → [Tampilkan List Kemungkinan Pemilik]
                → [No] → [Lanjut]
            → [Tampilkan Pesan Sukses] → [End]
```

## 4.5 Use Case: Pencarian Barang

### 4.5.1 Deskripsi Use Case

Use case ini menjelaskan proses user mencari barang hilang atau barang temuan dalam sistem menggunakan berbagai kriteria pencarian seperti keyword, kategori, lokasi, dan rentang waktu. Sistem akan menampilkan hasil yang relevan dan user dapat melihat detail setiap laporan.

### 4.5.2 Stimulus and Response

| Action by User | Response from System |
|---------------|---------------------|
| 1. User mengakses halaman pencarian | |
| | 2. Sistem menampilkan search bar, filter kategori, filter lokasi, filter tanggal, dan toggle untuk tipe laporan (Hilang/Temuan) |
| 3. User memasukkan keyword di search bar atau memilih filter | |
| | 4. Sistem melakukan pencarian real-time di database |
| | 5. Sistem menampilkan hasil dalam bentuk card/grid dengan foto thumbnail, nama barang, kategori, lokasi, dan tanggal |
| 6. User dapat mengurutkan hasil berdasarkan tanggal (terbaru/terlama) atau relevansi | |
| | 7. Sistem mengurutkan ulang hasil sesuai pilihan |
| 8. User mengklik salah satu hasil untuk melihat detail | |
| | 9. Sistem menampilkan halaman detail lengkap dengan semua informasi dan tombol kontak |

### 4.5.3 Activity Diagram

```
[Start] → [User Akses Halaman Pencarian] → [Tampilkan Interface Pencarian]
    → [User Input Keyword/Filter] → [Sistem Query Database]
    → [Proses Pencarian] → {Hasil Ditemukan?}
        → [Yes] → [Tampilkan List Hasil] → [User Pilih Sorting]
            → [Sistem Sort Hasil] → [Update Tampilan]
            → [User Klik Detail] → [Tampilkan Halaman Detail] → [End]
        → [No] → [Tampilkan Pesan: Tidak Ada Hasil] → [End]
```

## 4.6 Use Case: Notifikasi dan Pencocokan

### 4.6.1 Deskripsi Use Case

Use case ini menjelaskan proses otomatis sistem dalam mencocokkan laporan barang hilang dengan laporan barang temuan. Sistem menganalisis kemiripan berdasarkan kategori, deskripsi, lokasi, dan rentang waktu, kemudian mengirim notifikasi kepada pihak-pihak yang terkait.

### 4.6.2 Stimulus and Response

| Action by User | Response from System |
|---------------|---------------------|
| 1. User submit laporan baru (hilang atau temuan) | |
| | 2. Sistem menyimpan laporan ke database |
| | 3. Sistem menjalankan algoritma pencocokan dengan membandingkan kategori, keyword dalam deskripsi, lokasi, dan rentang waktu (±7 hari) |
| | 4. Sistem menghitung skor kemiripan untuk setiap kemungkinan match |
| | 5. Jika skor kemiripan > threshold (misalnya 70%), sistem menandai sebagai kemungkinan match |
| | 6. Sistem membuat notifikasi untuk kedua pihak (pelapor hilang dan pelapor temuan) |
| | 7. Sistem mengirim email notifikasi dan push notification (jika user login) |
| | 8. Sistem menampilkan notifikasi di dashboard user dengan badge angka |
| 9. User membuka notifikasi | |
| | 10. Sistem menampilkan detail match dengan link ke laporan terkait dan opsi untuk menghubungi pihak lain |

### 4.6.3 Activity Diagram

```
[Start: Laporan Baru Dibuat] → [Simpan Laporan] → [Jalankan Algoritma Pencocokan]
    → [Ambil Semua Laporan Tipe Berlawanan] → [Loop: Untuk Setiap Laporan]
        → [Hitung Skor Kemiripan] → [Compare: Kategori, Deskripsi, Lokasi, Waktu]
        → {Skor > Threshold?}
            → [Yes] → [Tandai Sebagai Kemungkinan Match] → [Buat Notifikasi]
                → [Kirim Email] → [Kirim Push Notification]
                → [Simpan ke Notification Table]
            → [No] → [Lanjut ke Laporan Berikutnya]
    → [End Loop] → [User Buka Notifikasi] → [Tampilkan Detail Match]
        → [User Pilih Hubungi] → [Tampilkan Form/Info Kontak] → [End]
```

## 4.7 Use Case: Mengelola Laporan (Admin)

### 4.7.1 Deskripsi Use Case

Use case ini menjelaskan proses administrator dalam mengelola semua laporan yang ada dalam sistem, termasuk memverifikasi, mengedit, atau menghapus laporan yang tidak sesuai dengan kebijakan. Admin juga dapat melihat statistik dan menghasilkan laporan berkala.

### 4.7.2 Stimulus and Response

| Action by User | Response from System |
|---------------|---------------------|
| 1. Admin login ke dashboard admin | |
| | 2. Sistem menampilkan dashboard dengan ringkasan statistik, laporan yang perlu diverifikasi, dan grafik tren |
| 3. Admin memilih menu "Kelola Laporan" | |
| | 4. Sistem menampilkan tabel semua laporan dengan kolom: ID, Tipe, Nama Barang, Pelapor, Tanggal, Status, dan Aksi |
| 5. Admin menggunakan filter atau search untuk menemukan laporan tertentu | |
| | 6. Sistem memfilter dan menampilkan hasil |
| 7. Admin mengklik tombol "Verifikasi" pada laporan yang pending | |
| | 8. Sistem menampilkan detail laporan lengkap |
| 9. Admin menyetujui atau menolak laporan dengan memberikan alasan jika ditolak | |
| | 10. Sistem mengupdate status laporan dan mengirim notifikasi kepada pelapor |
| 11. Admin dapat mengedit konten laporan yang tidak sesuai | |
| | 12. Sistem menyimpan perubahan dan log aktivitas admin |
| 13. Admin dapat menghapus laporan spam atau melanggar kebijakan | |
| | 14. Sistem menghapus laporan dan mencatat dalam log audit |
| 15. Admin memilih menu "Statistik" | |
| | 16. Sistem menampilkan grafik dan chart: jumlah laporan per bulan, kategori terpopuler, tingkat keberhasilan pengembalian, user paling aktif |
| 17. Admin dapat generate dan download report dalam format PDF atau Excel | |
| | 18. Sistem membuat file report dan menyediakannya untuk diunduh |

### 4.7.3 Activity Diagram

```
[Start] → [Admin Login] → [Tampilkan Dashboard Admin]
    → [Admin Pilih Menu] → {Menu Apa?}
        → [Kelola Laporan] → [Tampilkan Tabel Laporan]
            → [Admin Filter/Search] → [Tampilkan Hasil]
            → [Admin Pilih Aksi] → {Aksi?}
                → [Verifikasi] → [Tampilkan Detail] → [Admin Approve/Reject]
                    → [Update Status] → [Kirim Notifikasi] → [Log Aktivitas]
                → [Edit] → [Tampilkan Form Edit] → [Admin Edit Konten]
                    → [Simpan Perubahan] → [Log Aktivitas]
                → [Hapus] → [Konfirmasi Hapus] → {Admin Konfirmasi?}
                    → [Yes] → [Hapus Laporan] → [Log Audit]
                    → [No] → [Batal]
        → [Statistik] → [Generate Chart & Graph] → [Tampilkan Dashboard Statistik]
            → [Admin Pilih Generate Report] → [Buat File Report]
            → [Download Report]
        → [Kelola User] → [Tampilkan Daftar User] → [Admin Pilih Aksi User]
            → [Nonaktifkan/Aktifkan/Hapus] → [Update Database] → [Log Aktivitas]
    → [End]
```

## 4.8 Class Diagram

```
+-------------------+          +-------------------+
|      User         |          |   Administrator   |
+-------------------+          +-------------------+
| - userId: int     |          | - adminId: int    |
| - name: string    |          | - username: string|
| - email: string   |          | - password: string|
| - password: string|          | - role: string    |
| - phoneNumber:str |          +-------------------+
| - profilePhoto:str|          | + login()         |
| - createdAt: date |          | + manageLaporan() |
| - isVerified: bool|          | + verifyLaporan() |
+-------------------+          | + deleteUser()    |
| + register()      |          | + viewStatistics()|
| + login()         |          +-------------------+
| + updateProfile() |
| + logout()        |
+-------------------+
         |
         | 1..*
         |
         v
+-------------------+
|     Laporan       |
+-------------------+
| - laporanId: int  |
| - userId: int     | (FK)
| - tipeLaporan: str| (Hilang/Temuan)
| - namaBarang: str |
| - kategori: string|
| - deskripsi: text |
| - lokasi: string  |
| - tanggal: date   |
| - status: string  | (Aktif/Ditemukan/Closed)
| - kontakInfo: str |
| - createdAt: date |
| - updatedAt: date |
+-------------------+
| + createLaporan() |
| + updateLaporan() |
| + deleteLaporan() |
| + changeStatus()  |
+-------------------+
         |
         | 1..*
         |
         v
+-------------------+
|       Foto        |
+-------------------+
| - fotoId: int     |
| - laporanId: int  | (FK)
| - fileName: string|
| - filePath: string|
| - fileSize: int   |
| - uploadDate: date|
+-------------------+
| + uploadFoto()    |
| + deleteFoto()    |
+-------------------+

+-------------------+
|    Kategori       |
+-------------------+
| - kategoriId: int |
| - namaKategori:str|
| - deskripsi: text |
+-------------------+
| + getAllKategori()|
+-------------------+
         ^
         |
         | (reference)
         |
      Laporan

+-------------------+          +-------------------+
|    Notifikasi     |          |      Match        |
+-------------------+          +-------------------+
| - notifId: int    |          | - matchId: int    |
| - userId: int     | (FK)     | - laporanHilangId |
| - laporanId: int  | (FK)     | - laporanTemuanId |
| - message: text   |          | - skorKemiripan:fl|
| - type: string    |          | - status: string  |
| - isRead: boolean |          | - createdAt: date |
| - createdAt: date |          +-------------------+
+-------------------+          | + createMatch()   |
| + sendNotifikasi()|          | + calculateScore()|
| + markAsRead()    |          | + updateStatus()  |
| + deleteNotifikasi()         +-------------------+
+-------------------+
         ^
         |
    User | 1..*
         |

+-------------------+
|    Komunikasi     |
+-------------------+
| - komunikasiId:int|
| - senderId: int   | (FK to User)
| - receiverId: int | (FK to User)
| - laporanId: int  | (FK)
| - message: text   |
| - sentAt: datetime|
+-------------------+
| + sendMessage()   |
| + getMessages()   |
+-------------------+

+-------------------+
|    AuditLog       |
+-------------------+
| - logId: int      |
| - adminId: int    | (FK)
| - action: string  |
| - targetId: int   |
| - targetType: str |
| - description: txt|
| - timestamp: date |
+-------------------+
| + createLog()     |
| + getLogs()       |
+-------------------+
```

**Penjelasan Relationship:**
- User memiliki relasi one-to-many dengan Laporan (satu user dapat membuat banyak laporan)
- Laporan memiliki relasi one-to-many dengan Foto (satu laporan dapat memiliki banyak foto)
- Laporan memiliki relasi many-to-one dengan Kategori (banyak laporan termasuk dalam satu kategori)
- User memiliki relasi one-to-many dengan Notifikasi (satu user dapat menerima banyak notifikasi)
- Match menghubungkan dua Laporan (satu hilang dan satu temuan) dalam relasi many-to-many
- Komunikasi menghubungkan dua User dalam relasi many-to-many melalui Laporan
- Administrator memiliki relasi one-to-many dengan AuditLog (satu admin dapat melakukan banyak aktivitas yang dicatat)

---

# 5. Non Functional Requirements

| ID | Parameter | Kebutuhan |
|----|-----------|-----------|
| NFR-001 | Availability | Aplikasi harus tersedia 99% dari waktu operasional (24/7), dengan downtime maksimal 7 jam per bulan untuk maintenance terjadwal |
| NFR-002 | Reliability | Sistem harus memiliki tingkat kegagalan maksimal 0.1% untuk operasi critical (login, submit laporan, search). Implementasi backup otomatis harian untuk data |
| NFR-003 | Performance - Response Time | Halaman utama harus dimuat dalam waktu maksimal 2 detik. Pencarian harus mengembalikan hasil dalam maksimal 3 detik. Upload foto maksimal 5 detik per file |
| NFR-004 | Performance - Throughput | Sistem harus mampu menangani minimal 500 concurrent users tanpa degradasi performa signifikan |
| NFR-005 | Scalability | Arsitektur sistem harus dapat ditingkatkan kapasitasnya (scale up/scale out) untuk menangani pertumbuhan user hingga 10,000 users |
| NFR-006 | Usability - Ergonomy | Interface harus intuitif dengan maksimal 3 klik untuk mengakses fitur utama. Tersedia panduan visual (tooltip, helper text) di setiap form |
| NFR-007 | Usability - Accessibility | Aplikasi harus memenuhi standar WCAG 2.1 Level AA untuk aksesibilitas (contrast ratio, keyboard navigation, screen reader support) |
| NFR-008 | Portability | Aplikasi harus dapat diakses dan berfungsi dengan baik di berbagai browser (Chrome, Firefox, Safari, Edge) dan berbagai ukuran layar (responsive design) |
| NFR-009 | Security - Authentication | Implementasi autentikasi yang aman menggunakan password hashing (bcrypt) dengan minimum 8 karakter termasuk huruf besar, kecil, dan angka |
| NFR-010 | Security - Authorization | Role-based access control (RBAC) untuk membedakan hak akses antara user biasa dan administrator |
| NFR-011 | Security - Data Protection | Semua komunikasi harus menggunakan HTTPS/TLS 1.2+. Data sensitif (password) harus dienkripsi di database |
| NFR-012 | Security - Input Validation | Semua input user harus divalidasi dan disanitasi untuk mencegah SQL Injection, XSS, dan CSRF attacks |
| NFR-013 | Memory | Konsumsi memory di client-side maksimal 200 MB untuk menghindari lag pada perangkat dengan spesifikasi rendah |
| NFR-014 | Storage | Sistem penyimpanan harus dapat menampung minimal 10,000 laporan dengan rata-rata 3 foto per laporan (total ~150 GB) |
| NFR-015 | Database Performance | Query database harus dioptimasi dengan indexing yang tepat. Query kompleks maksimal 1 detik untuk eksekusi |
| NFR-016 | Maintainability | Kode harus mengikuti coding standards dengan dokumentasi lengkap. Modular architecture untuk memudahkan maintenance dan penambahan fitur |
| NFR-017 | Bahasa Komunikasi | Semua teks interface, notifikasi, dan dokumentasi harus dalam Bahasa Indonesia yang baku dan mudah dipahami |
| NFR-018 | Branding | Setiap halaman harus menampilkan logo UIN Sunan Kalijaga Yogyakarta dan mengikuti color scheme identitas kampus (hijau dan putih) |
| NFR-019 | Data Backup | Backup database otomatis setiap hari pukul 02:00 WIB dengan retention period 30 hari |
| NFR-020 | Error Handling | Sistem harus menampilkan pesan error yang user-friendly (tidak menampilkan technical error ke user). Log error detail disimpan untuk debugging |
| NFR-021 | Notification Delivery | Email notifikasi harus terkirim dalam waktu maksimal 5 menit setelah event trigger |
| NFR-022 | Data Retention | Laporan dengan status "Ditemukan" atau "Closed" akan diarsipkan setelah 6 bulan dan dapat dihapus setelah 1 tahun |
| NFR-023 | Compatibility | Aplikasi harus kompatibel dengan browser versi terbaru dan 2 versi sebelumnya |
| NFR-024 | Legal Compliance | Sistem harus mematuhi regulasi perlindungan data pribadi (UU ITE dan kebijakan privasi kampus) |
| NFR-025 | Monitoring | Implementasi system monitoring untuk tracking uptime, response time, error rate, dan user activity |

---

## Catatan Penutup

Dokumen Software Requirements Specification (SRS) untuk aplikasi "Suka Kehilangan" ini telah disusun secara komprehensif mencakup seluruh aspek fungsional dan non-fungsional yang diperlukan untuk pengembangan sistem. Dokumen ini akan menjadi acuan utama bagi tim pengembang, penguji, dan stakeholder dalam proses pembangunan dan implementasi aplikasi.

Setiap perubahan atau penambahan requirement harus didokumentasikan dalam Revision History dan dikomunikasikan kepada seluruh pihak terkait untuk memastikan sinkronisasi pemahaman dan ekspektasi.

**Persetujuan:**

| Role | Nama | Tanda Tangan | Tanggal |
|------|------|--------------|---------|
| Project Manager | | | |
| Lead Developer | | | |
| Stakeholder (Pihak Kampus) | | | |

---

**Document Version:** 1.0  
**Last Updated:** <date created>  
**Next Review Date:** <date + 3 months>
