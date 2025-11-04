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
| ---- | ---- | ------------------ | ------- |
|      |      |                    |         |

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
   - 4.3 [Use Case: Melaporkan Barang Hilang (User)](#43-use-case-melaporkan-barang-hilang-user)
   - 4.4 [Use Case: Upload dan Kelola Barang Temuan (Petugas)](#44-use-case-upload-dan-kelola-barang-temuan-petugas)
   - 4.5 [Use Case: Klaim dan Verifikasi Barang](#45-use-case-klaim-dan-verifikasi-barang)
   - 4.6 [Use Case: Manajemen User dan Petugas (Admin)](#46-use-case-manajemen-user-dan-petugas-admin)
   - 4.7 [Use Case: Laporan dan Export Data (Admin)](#47-use-case-laporan-dan-export-data-admin)
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

Aplikasi "Suka Kehilangan" adalah platform web berbasis manajemen terpusat yang dirancang khusus untuk memfasilitasi pelaporan dan pengelolaan barang hilang di lingkungan Universitas Islam Negeri Sunan Kalijaga Yogyakarta. Aplikasi ini bertujuan untuk mengatasi ketidakefisienan dalam proses pencarian barang hilang yang selama ini mengandalkan media sosial atau pengumuman manual yang memiliki jangkauan terbatas.

Manfaat utama dari aplikasi ini adalah:

- Menyediakan platform terpusat untuk pelaporan barang hilang oleh civitas akademika
- Memfasilitasi petugas satpam dalam mengelola barang temuan secara terstruktur
- Mempercepat proses verifikasi klaim kepemilikan barang melalui sistem yang terorganisir
- Meningkatkan peluang barang hilang kembali kepada pemiliknya melalui proses yang sistematis
- Menyediakan data dan laporan lengkap untuk monitoring dan evaluasi
- Membangun sistem keamanan dan kepedulian yang terkelola dengan baik di lingkungan kampus

Aplikasi ini mendukung strategi Universitas dalam menciptakan lingkungan kampus yang aman, tertib, dan memiliki sistem pengelolaan kehilangan barang yang profesional.

## 1.4 Definisi dan Istilah

- **SRS**: Software Requirements Specification, atau Spesifikasi Kebutuhan Perangkat Lunak (SKPL)
- **IEEE**: Institute of Electrical and Electronics Engineering, standar internasional untuk pengembangan dan perancangan produk
- **User**: Pengguna aplikasi, yaitu civitas akademika UIN Sunan Kalijaga Yogyakarta (mahasiswa, dosen, dan staff) yang melaporkan barang hilang
- **Petugas/Satpam**: Petugas keamanan kampus yang bertugas mengelola barang temuan, verifikasi klaim, dan melihat laporan kehilangan
- **Admin**: Administrator sistem yang mengelola user, petugas, dan memiliki akses penuh terhadap semua data serta laporan sistem
- **Pelapor Kehilangan**: User yang melaporkan barang yang hilang
- **Laporan Kehilangan**: Entri data mengenai barang hilang yang diinput oleh user
- **Barang Temuan**: Barang yang ditemukan dan diunggah oleh petugas satpam ke dalam sistem
- **Klaim Barang**: Permintaan pengambilan barang temuan oleh user yang mengaku sebagai pemilik
- **Verifikasi Klaim**: Proses pemeriksaan dan persetujuan klaim kepemilikan barang oleh petugas
- **Kategori Barang**: Pengelompokan jenis barang (elektronik, dokumen, aksesoris, dll.)
- **Status Laporan**: Kondisi terkini dari laporan (Aktif, Ditemukan, Diambil, Ditolak, Closed)

## 1.5 Referensi

- IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications
- Dokumen latar belakang proyek "Suka Kehilangan"
- Kebijakan dan regulasi UIN Sunan Kalijaga Yogyakarta terkait pengelolaan barang hilang

---

# 2. Deskripsi Keseluruhan

## 2.1 Deskripsi Produk

"Suka Kehilangan" adalah aplikasi web platform yang dirancang sebagai solusi modern untuk mengatasi masalah kehilangan barang di lingkungan Universitas Islam Negeri Sunan Kalijaga Yogyakarta. Aplikasi ini menyediakan wadah terpusat dengan sistem role-based yang menghubungkan tiga pihak utama: civitas akademika (sebagai pelapor kehilangan), petugas satpam (sebagai pengelola barang temuan), dan administrator (sebagai pengawas sistem).

Sistem ini bekerja dengan alur sebagai berikut: civitas akademika melaporkan barang yang hilang melalui aplikasi, petugas satpam mengunggah dan mengelola barang yang ditemukan, kemudian ketika ada klaim dari user terhadap barang temuan, petugas melakukan verifikasi untuk memastikan kepemilikan sebelum barang diserahkan. Administrator memiliki akses penuh untuk mengelola user dan petugas, serta dapat melihat dan mengekspor laporan lengkap untuk keperluan monitoring dan evaluasi.

Aplikasi ini dirancang dengan antarmuka yang user-friendly dan dapat diakses melalui berbagai perangkat (desktop, tablet, smartphone) untuk memastikan kemudahan akses bagi seluruh civitas akademika dan petugas.

## 2.2 Fungsi Produk

Fungsi utama aplikasi "Suka Kehilangan" meliputi:

**Untuk User (Civitas Akademika):**

- Mendaftar dan login ke sistem dengan menggunakan email institusi UIN Sunan Kalijaga
- Mengelola dan memperbarui profil pribadi
- Melaporkan barang hilang dengan informasi detail seperti nama barang, kategori, deskripsi, foto, lokasi, dan waktu kehilangan
- Melihat daftar barang temuan yang telah diunggah oleh petugas
- Mengajukan klaim kepemilikan terhadap barang temuan
- Melihat status laporan kehilangan dan klaim yang telah diajukan
- Menerima notifikasi terkait status klaim

**Untuk Petugas/Satpam:**

- Login ke sistem dengan akun petugas
- Mengunggah barang temuan dengan informasi detail seperti nama barang, kategori, deskripsi, foto, lokasi, dan waktu penemuan
- Mengelola data barang temuan (edit, update status, hapus)
- Melihat semua laporan kehilangan yang masuk dari user
- Memverifikasi klaim kepemilikan barang yang diajukan oleh user
- Menyetujui atau menolak klaim dengan memberikan alasan
- Mengubah status barang temuan (tersedia, diklaim, diambil, dll)

**Untuk Administrator:**

- Login ke dashboard admin dengan hak akses penuh
- Mengelola data user (lihat, tambah, edit, nonaktifkan, hapus)
- Mengelola data petugas (lihat, tambah, edit, nonaktifkan, hapus)
- Melihat laporan lengkap dari semua data barang hilang, barang temuan, dan barang yang sudah diverifikasi
- Mengekspor data laporan dalam berbagai format (PDF, Excel, CSV)
- Melihat statistik dan dashboard analytics sistem
- Mengelola kategori barang dan pengaturan sistem

## 2.3 Penggolongan Karakteristik Pengguna

| Kategori Pengguna            | Tugas                                                                                                                                                   | Hak Akses ke Aplikasi                                                                                                                                          | Kemampuan yang Harus Dimiliki                                                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Civitas Akademika (User)** | - Melaporkan barang hilang<br>- Melihat daftar barang temuan<br>- Mengajukan klaim barang<br>- Memperbarui profil<br>- Melihat status laporan dan klaim | - Create laporan kehilangan<br>- Read barang temuan<br>- Create klaim barang<br>- Update profil sendiri<br>- Read status laporan sendiri                       | - Kemampuan menggunakan browser web<br>- Kemampuan mengunggah foto<br>- Kemampuan menulis deskripsi barang<br>- Memiliki email institusi UIN Sunan Kalijaga                    |
| **Petugas/Satpam**           | - Upload barang temuan<br>- Manajemen barang temuan<br>- Verifikasi klaim barang<br>- Melihat laporan kehilangan<br>- Approve/Reject klaim              | - Full CRUD barang temuan<br>- Read semua laporan kehilangan<br>- Update status klaim<br>- Verifikasi kepemilikan barang                                       | - Kemampuan dokumentasi barang<br>- Kemampuan verifikasi identitas<br>- Pemahaman prosedur keamanan<br>- Kemampuan komunikasi yang baik<br>- Akun petugas yang diberikan admin |
| **Administrator**            | - Mengelola user dan petugas<br>- Melihat semua data laporan<br>- Export laporan<br>- Monitoring sistem<br>- Mengelola pengaturan sistem                | - Full access (CRUD) user dan petugas<br>- Read all data laporan<br>- Export data dalam berbagai format<br>- Akses dashboard analytics<br>- Konfigurasi sistem | - Kemampuan manajemen sistem<br>- Pemahaman kebijakan kampus<br>- Kemampuan analisis data<br>- Kemampuan generate dan membaca laporan<br>- Skill administrasi yang baik        |

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

   - **Untuk User/Civitas Akademika:**

     - Panduan lengkap cara menggunakan aplikasi
     - Step-by-step untuk melaporkan barang hilang
     - Panduan melihat dan mengajukan klaim barang temuan
     - Cara melihat status laporan dan klaim
     - FAQ (Frequently Asked Questions)

   - **Untuk Petugas/Satpam:**

     - Panduan upload dan kelola barang temuan
     - Prosedur verifikasi klaim kepemilikan
     - Cara melihat laporan kehilangan dari user
     - Best practices dalam pengelolaan barang temuan
     - FAQ spesifik petugas

   - **Untuk Administrator:**
     - Panduan pengelolaan user dan petugas
     - Cara melihat dan menganalisis semua data laporan
     - Panduan export data dalam berbagai format
     - Panduan penggunaan dashboard analytics
     - Manajemen kategori dan pengaturan sistem

2. **Quick Start Guide**

   - Panduan singkat untuk memulai menggunakan aplikasi (per role)
   - Flowchart proses pelaporan dan klaim
   - Flowchart proses verifikasi oleh petugas
   - Tips efektif melaporkan barang hilang
   - Tips petugas dalam mengelola barang temuan

3. **Online Help (In-app Help)**

   - Tooltip pada setiap form input
   - Help icon yang dapat diklik untuk penjelasan fitur
   - Tutorial video singkat untuk fitur-fitur utama setiap role
   - Contextual help berdasarkan role user

4. **Standard Operating Procedure (SOP)**

   - SOP Petugas dalam mengelola barang temuan
   - SOP Verifikasi klaim kepemilikan barang
   - SOP Penyerahan barang kepada pemilik
   - SOP Admin dalam pengelolaan sistem

5. **Technical Documentation**

   - API Documentation
   - Database schema dengan relationship diagram
   - System architecture
   - Deployment guide
   - Role-based access control documentation

6. **Video Tutorial**
   - Tutorial penggunaan untuk user
   - Tutorial penggunaan untuk petugas
   - Tutorial penggunaan untuk admin
   - Tutorial troubleshooting umum

---

# 3. Kebutuhan Antarmuka Eksternal

## 3.1 User Interfaces

Antarmuka pengguna aplikasi "Suka Kehilangan" dirancang dengan prinsip user-friendly, intuitif, dan responsive. Berikut adalah karakteristik antarmuka untuk setiap komponen:

**Halaman Utama (Landing Page)**:

- Header dengan logo UIN Sunan Kalijaga dan nama aplikasi
- Navigation bar: Home, Barang Temuan, Tentang, Login/Register
- Hero section dengan call-to-action untuk melaporkan kehilangan barang
- Daftar barang temuan terbaru dalam bentuk card dengan thumbnail foto
- Search bar untuk mencari barang temuan
- Footer dengan informasi kontak dan link penting

**Halaman Login/Register**:

- Form sederhana dengan field email institusi dan password
- Dropdown untuk memilih role (User/Petugas) saat login
- Validasi real-time untuk input
- Link untuk lupa password
- Pesan error yang jelas dan membantu

**Dashboard User**:

- Sidebar menu: Dashboard, Laporan Kehilangan Saya, Buat Laporan, Barang Temuan, Klaim Saya, Profil
- Area konten utama yang menampilkan ringkasan laporan user
- Status klaim barang yang sedang diproses
- Quick action button untuk membuat laporan kehilangan baru

**Dashboard Petugas**:

- Sidebar menu: Dashboard, Barang Temuan, Upload Barang, Laporan Kehilangan, Verifikasi Klaim, Profil
- Area konten utama dengan statistik barang temuan
- Daftar klaim yang menunggu verifikasi
- Quick action untuk upload barang temuan

**Dashboard Admin**:

- Sidebar menu: Dashboard, Kelola User, Kelola Petugas, Laporan Kehilangan, Barang Temuan, Verifikasi Klaim, Export Data, Statistik
- Statistik dashboard dengan chart dan grafik
- Tabel dengan fitur sorting dan filtering
- Action buttons untuk manage user dan petugas

**Form Pelaporan Kehilangan (User)**:

- Layout yang clean dengan field yang terorganisir
- Upload area untuk foto dengan drag-and-drop support
- Dropdown untuk kategori barang
- Date picker untuk tanggal kehilangan
- Text area untuk deskripsi detail
- Input lokasi kehilangan
- Button "Submit" yang prominent

**Form Upload Barang Temuan (Petugas)**:

- Layout form serupa dengan pelaporan
- Upload foto barang yang ditemukan
- Kategori, deskripsi, lokasi dan tanggal penemuan
- Input kondisi barang
- Tempat penyimpanan barang

**Halaman Detail Barang Temuan**:

- Gallery foto yang dapat diperbesar
- Informasi detail barang dalam format yang mudah dibaca
- Tombol "Klaim Barang Ini" untuk user
- Status ketersediaan barang
- Informasi petugas yang mengelola

**Halaman Verifikasi Klaim (Petugas)**:

- Informasi detail klaim dan identitas pengklaim
- Foto barang yang diklaim
- Form verifikasi dengan opsi approve/reject
- Text area untuk catatan verifikasi
- Upload bukti penyerahan barang (opsional)

**Standar Desain**:

- Warna utama menggunakan palet warna identitas UIN Sunan Kalijaga
- Font yang mudah dibaca (seperti Inter, Roboto, atau Open Sans)
- Icon set yang konsisten (menggunakan Font Awesome atau Material Icons)
- Button dengan feedback visual (hover, active states)
- Loading indicators untuk operasi yang memerlukan waktu
- Error messages yang informatif dan helpful
- Success notifications yang jelas
- Badge untuk menunjukkan status (pending, approved, rejected, dll)

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

| ID     | Kebutuhan Fungsional       | Penjelasan                                                                                                                                                        |
| ------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001 | Registrasi User            | Sistem harus memungkinkan civitas akademika untuk mendaftar menggunakan email institusi UIN Sunan Kalijaga (@uin-suka.ac.id)                                      |
| FR-002 | Login dan Autentikasi      | Sistem harus memungkinkan user, petugas, dan admin untuk login dengan email dan password sesuai role masing-masing                                                |
| FR-003 | Manajemen Profil User      | User dapat mengelola dan memperbarui profil mereka termasuk nama, nomor telepon, dan foto profil                                                                  |
| FR-004 | Melaporkan Barang Hilang   | User dapat membuat laporan barang hilang dengan mengisi form yang berisi nama barang, kategori, deskripsi, foto, lokasi, tanggal kehilangan, dan informasi kontak |
| FR-005 | Edit Laporan Kehilangan    | User dapat mengedit laporan kehilangan yang telah mereka buat selama belum ada proses klaim                                                                       |
| FR-006 | Hapus Laporan Kehilangan   | User dapat menghapus laporan kehilangan yang telah mereka buat                                                                                                    |
| FR-007 | Lihat Status Laporan       | User dapat melihat status laporan kehilangan mereka (Aktif, Ditemukan, Closed)                                                                                    |
| FR-008 | Upload Barang Temuan       | Petugas dapat mengunggah barang temuan dengan informasi lengkap termasuk foto, kategori, deskripsi, lokasi, tanggal, kondisi, dan tempat penyimpanan              |
| FR-009 | Manajemen Barang Temuan    | Petugas dapat mengelola (view, edit, update status, hapus) data barang temuan yang telah diunggah                                                                 |
| FR-010 | Lihat Laporan Kehilangan   | Petugas dapat melihat semua laporan kehilangan yang masuk dari user untuk membantu proses pencocokan                                                              |
| FR-011 | Verifikasi Klaim Barang    | Petugas dapat memverifikasi klaim kepemilikan barang yang diajukan oleh user dengan approve atau reject                                                           |
| FR-012 | Upload Foto                | Sistem harus memungkinkan user dan petugas untuk mengunggah maksimal 5 foto per laporan dengan ukuran maksimal 5 MB per foto                                      |
| FR-013 | Kategorisasi Barang        | Sistem menyediakan kategori barang (Elektronik, Dokumen, Aksesoris, Pakaian, Kunci, Alat Tulis, Lainnya) untuk klasifikasi                                        |
| FR-014 | Lihat Daftar Barang Temuan | User dapat melihat semua barang temuan yang tersedia dengan filter kategori, lokasi, dan tanggal                                                                  |
| FR-015 | Detail Barang Temuan       | User dapat melihat informasi detail dari setiap barang temuan termasuk foto lengkap dan cara klaim                                                                |
| FR-016 | Klaim Barang Temuan        | User dapat mengajukan klaim kepemilikan terhadap barang temuan dengan mengisi form bukti kepemilikan                                                              |
| FR-017 | Notifikasi Status Klaim    | Sistem mengirim notifikasi kepada user tentang status klaim mereka (diproses, disetujui, ditolak)                                                                 |
| FR-018 | Manajemen User (Admin)     | Admin dapat mengelola data user (lihat, tambah, edit, nonaktifkan, hapus akun user)                                                                               |
| FR-019 | Manajemen Petugas (Admin)  | Admin dapat mengelola data petugas (lihat, tambah, edit, nonaktifkan, hapus akun petugas)                                                                         |
| FR-020 | Lihat Semua Data Laporan   | Admin dapat melihat semua data laporan kehilangan, barang temuan, dan status verifikasi                                                                           |
| FR-021 | Export Data Laporan        | Admin dapat mengekspor data laporan dalam format PDF, Excel, atau CSV untuk keperluan arsip dan evaluasi                                                          |
| FR-022 | Dashboard Analytics        | Sistem menyediakan dashboard dengan statistik untuk admin (jumlah barang hilang, barang temuan, tingkat keberhasilan klaim, tren per kategori)                    |
| FR-023 | Filter dan Pencarian       | Sistem menyediakan fitur filter dan pencarian untuk semua daftar (laporan, barang temuan, user, petugas)                                                          |
| FR-024 | Riwayat Laporan User       | Sistem menampilkan riwayat semua laporan dan klaim yang pernah dibuat oleh user                                                                                   |
| FR-025 | Riwayat Aktivitas Petugas  | Sistem mencatat semua aktivitas petugas (upload, verifikasi, update status)                                                                                       |
| FR-026 | Email Notifikasi           | Sistem mengirim email notifikasi untuk event penting (klaim baru, verifikasi klaim, perubahan status)                                                             |
| FR-027 | Forgot Password            | User dan petugas dapat melakukan reset password melalui email verifikasi                                                                                          |
| FR-028 | Logout                     | User, petugas, dan admin dapat logout dari sistem dan menghapus session                                                                                           |
| FR-029 | Audit Log                  | Sistem mencatat semua aktivitas penting untuk audit trail (login, perubahan data, verifikasi, dll)                                                                |
| FR-030 | Manajemen Kategori         | Admin dapat menambah, edit, atau hapus kategori barang                                                                                                            |

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
          [Register &       [Update Profil]   [Laporkan
           Login]                              Barang Hilang]
                 |                                   |
                 |                                   v
                 |                            [Edit/Hapus
                 |                             Laporan]
                 |                                   |
                 +--------+------------------+-------+
                          |                  |
                          v                  v
                  [Lihat Barang         [Ajukan Klaim
                    Temuan]               Barang]
                          |                  |
                          v                  v
                  [Lihat Detail]      [Lihat Status Klaim]


                          +------------------+
                          | Petugas/Satpam   |
                          +------------------+
                                   |
                 +-----------------+-----------------+
                 |                 |                 |
                 v                 v                 v
          [Upload Barang]   [Kelola Barang]  [Lihat Laporan
           Temuan]           Temuan]          Kehilangan]
                 |                 |                 |
                 |                 v                 |
                 |          [Update Status           |
                 |           Barang]                 |
                 +------------------+----------------+
                                    |
                                    v
                           [Verifikasi Klaim]
                                    |
                                    v
                           [Approve/Reject Klaim]


                          +------------------+
                          |  Administrator   |
                          +------------------+
                                   |
                 +-----------------+-----------------+
                 |                 |                 |
                 v                 v                 v
          [Kelola User]     [Kelola Petugas]  [Lihat Semua
                                                Laporan]
                 |                 |                 |
                 |                 |                 v
                 |                 |          [Export Data
                 |                 |           Laporan]
                 |                 |                 |
                 +--------+--------+--------+--------+
                          |                 |
                          v                 v
                  [Kelola Kategori]  [Dashboard
                                      Analytics]


                          +------------------+
                          |  Email System    |
                          |    (External)    |
                          +------------------+
                                   ^
                                   |
                          [Kirim Notifikasi Email]
                          (Status Klaim, Verifikasi)
```

## 4.2 Use Case: Registrasi dan Login

### 4.2.1 Deskripsi Use Case

Use case ini menggambarkan proses pendaftaran user baru dan proses login ke dalam sistem "Suka Kehilangan". User harus menggunakan email institusi UIN Sunan Kalijaga untuk dapat mendaftar. Setelah registrasi berhasil, user dapat login menggunakan kredensial yang telah dibuat.

### 4.2.2 Stimulus and Response

| Action by User                                                                          | Response from System                                                                                                                      |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1. User mengakses halaman registrasi                                                    |                                                                                                                                           |
|                                                                                         | 2. Sistem menampilkan form registrasi dengan field: nama lengkap, email institusi, nomor telepon, password, dan konfirmasi password       |
| 3. User mengisi form dan menekan tombol "Daftar"                                        |                                                                                                                                           |
|                                                                                         | 4. Sistem memvalidasi input, memeriksa apakah email menggunakan domain @uin-suka.ac.id, dan memeriksa apakah email sudah terdaftar        |
|                                                                                         | 5. Jika validasi berhasil, sistem membuat akun baru dengan role "User" dan mengirim email verifikasi                                      |
|                                                                                         | 6. Sistem menampilkan pesan sukses dan mengarahkan ke halaman login                                                                       |
| 7. User mengklik link verifikasi di email                                               |                                                                                                                                           |
|                                                                                         | 8. Sistem mengaktifkan akun dan menampilkan konfirmasi                                                                                    |
| 9. User/Petugas/Admin memasukkan email dan password di halaman login, lalu klik "Login" |                                                                                                                                           |
|                                                                                         | 10. Sistem memverifikasi kredensial dan mengidentifikasi role pengguna                                                                    |
|                                                                                         | 11. Jika valid, sistem membuat session dan mengarahkan ke dashboard sesuai role (User Dashboard, Petugas Dashboard, atau Admin Dashboard) |

### 4.2.3 Activity Diagram

```
[Start] → [User Akses Halaman Registrasi] → [Tampilkan Form Registrasi]
    → [User Isi Form] → [Validasi Input]
    → {Email Valid?}
        → [Yes] → {Email Belum Terdaftar?}
            → [Yes] → [Buat Akun Baru dengan Role "User"] → [Kirim Email Verifikasi]
                → [Tampilkan Pesan Sukses] → [User Klik Link Verifikasi]
                → [Aktivasi Akun] → [User/Petugas/Admin Login] → [Verifikasi Kredensial]
                → {Kredensial Valid?}
                    → [Yes] → [Identifikasi Role] → {Role?}
                        → [User] → [Buat Session] → [Redirect ke User Dashboard] → [End]
                        → [Petugas] → [Buat Session] → [Redirect ke Petugas Dashboard] → [End]
                        → [Admin] → [Buat Session] → [Redirect ke Admin Dashboard] → [End]
                    → [No] → [Tampilkan Error] → [End]
            → [No] → [Tampilkan Error: Email Sudah Terdaftar] → [End]
        → [No] → [Tampilkan Error: Email Harus @uin-suka.ac.id] → [End]
```

## 4.3 Use Case: Melaporkan Barang Hilang (User)

### 4.3.1 Deskripsi Use Case

Use case ini menjelaskan proses user (civitas akademika) melaporkan barang yang hilang ke dalam sistem. User mengisi formulir dengan detail barang yang hilang termasuk nama barang, kategori, deskripsi, foto, lokasi kehilangan, dan waktu kehilangan. Sistem akan menyimpan laporan dan menampilkannya di dashboard user.

### 4.3.2 Stimulus and Response

| Action by User                                          | Response from System                                                                                                                                                    |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. User login dan memilih menu "Laporkan Barang Hilang" |                                                                                                                                                                         |
|                                                         | 2. Sistem menampilkan form laporan dengan field: nama barang, kategori (dropdown), deskripsi, lokasi kehilangan, tanggal kehilangan, nomor kontak, dan area upload foto |
| 3. User mengisi semua field yang diperlukan             |                                                                                                                                                                         |
|                                                         | 4. Sistem melakukan validasi real-time untuk setiap field                                                                                                               |
| 5. User mengunggah foto barang (1-5 foto)               |                                                                                                                                                                         |
|                                                         | 6. Sistem memvalidasi format dan ukuran file, menampilkan preview foto                                                                                                  |
| 7. User menekan tombol "Submit Laporan"                 |                                                                                                                                                                         |
|                                                         | 8. Sistem memeriksa kelengkapan data                                                                                                                                    |
|                                                         | 9. Sistem menyimpan laporan ke database dengan status "Aktif"                                                                                                           |
|                                                         | 10. Sistem menampilkan pesan sukses dan mengarahkan ke halaman "Laporan Kehilangan Saya"                                                                                |
|                                                         | 11. Laporan dapat dilihat oleh petugas untuk membantu proses pencocokan dengan barang temuan                                                                            |

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
                    → [Set Status: Aktif] → [Tampilkan Pesan Sukses]
                    → [Redirect ke Laporan Kehilangan Saya] → [End]
```

## 4.4 Use Case: Upload dan Kelola Barang Temuan (Petugas)

### 4.4.1 Deskripsi Use Case

Use case ini menjelaskan proses petugas satpam mengunggah dan mengelola barang temuan dalam sistem. Petugas mengisi formulir dengan detail barang temuan termasuk nama barang, kategori, deskripsi, foto, lokasi penemuan, waktu penemuan, kondisi barang, dan tempat penyimpanan. Petugas juga dapat mengedit, mengubah status, atau menghapus barang temuan yang telah diunggah.

### 4.4.2 Stimulus and Response

| Action by User                                                        | Response from System                                                                                                                                                                     |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Petugas login dan memilih menu "Upload Barang Temuan"              |                                                                                                                                                                                          |
|                                                                       | 2. Sistem menampilkan form upload dengan field: nama barang, kategori (dropdown), deskripsi, lokasi penemuan, tanggal penemuan, kondisi barang, tempat penyimpanan, dan area upload foto |
| 3. Petugas mengisi semua field yang diperlukan dan mengunggah foto    |                                                                                                                                                                                          |
|                                                                       | 4. Sistem melakukan validasi real-time                                                                                                                                                   |
| 5. Petugas menekan tombol "Upload Barang"                             |                                                                                                                                                                                          |
|                                                                       | 6. Sistem menyimpan data barang temuan ke database dengan status "Tersedia"                                                                                                              |
|                                                                       | 7. Sistem menampilkan pesan sukses dan mengarahkan ke halaman "Barang Temuan"                                                                                                            |
| 8. Petugas dapat mengelola barang temuan melalui menu "Barang Temuan" |                                                                                                                                                                                          |
|                                                                       | 9. Sistem menampilkan daftar semua barang temuan yang diunggah oleh petugas                                                                                                              |
| 10. Petugas memilih aksi: Edit, Update Status, atau Hapus             |                                                                                                                                                                                          |
|                                                                       | 11. Sistem menjalankan aksi yang dipilih dan mengupdate database                                                                                                                         |
|                                                                       | 12. Sistem menampilkan konfirmasi perubahan                                                                                                                                              |

### 4.4.3 Activity Diagram

```
[Start] → [Petugas Login] → [Pilih Menu Upload Barang Temuan]
    → [Tampilkan Form Upload] → [Petugas Isi Form & Upload Foto]
    → [Validasi Input] → {Input Valid?}
        → [No] → [Tampilkan Error] → [Petugas Perbaiki]
        → [Yes] → [Submit Upload] → [Simpan ke Database]
            → [Set Status: Tersedia] → [Tampilkan Pesan Sukses]
            → [Redirect ke Halaman Barang Temuan]

[Petugas Akses Menu Barang Temuan] → [Tampilkan Daftar Barang]
    → [Petugas Pilih Aksi] → {Aksi?}
        → [Edit] → [Tampilkan Form Edit] → [Update Data] → [Simpan Perubahan] → [End]
        → [Update Status] → [Pilih Status Baru] → [Simpan Status] → [End]
        → [Hapus] → [Konfirmasi Hapus] → {Konfirmasi?}
            → [Yes] → [Hapus dari Database] → [End]
            → [No] → [Batal] → [End]
```

## 4.5 Use Case: Klaim dan Verifikasi Barang

### 4.5.1 Deskripsi Use Case

Use case ini menjelaskan proses user mengajukan klaim kepemilikan terhadap barang temuan dan proses petugas memverifikasi klaim tersebut. User melihat daftar barang temuan, mengajukan klaim dengan bukti kepemilikan, kemudian petugas melakukan verifikasi untuk memastikan barang dikembalikan kepada pemilik yang sah.

### 4.5.2 Stimulus and Response

| Action by User                                                                                  | Response from System                                                                                                               |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Proses Klaim oleh User:**                                                                     |                                                                                                                                    |
| 1. User login dan memilih menu "Barang Temuan"                                                  |                                                                                                                                    |
|                                                                                                 | 2. Sistem menampilkan daftar semua barang temuan yang tersedia dengan filter kategori dan pencarian                                |
| 3. User mengklik detail barang yang sesuai dengan barang yang hilang                            |                                                                                                                                    |
|                                                                                                 | 4. Sistem menampilkan detail lengkap barang termasuk foto, deskripsi, lokasi, tanggal penemuan, dan tombol "Klaim Barang Ini"      |
| 5. User mengklik tombol "Klaim Barang Ini"                                                      |                                                                                                                                    |
|                                                                                                 | 6. Sistem menampilkan form klaim dengan field: bukti kepemilikan (deskripsi), foto bukti (opsional), informasi tambahan            |
| 7. User mengisi form klaim dan submit                                                           |                                                                                                                                    |
|                                                                                                 | 8. Sistem menyimpan klaim dengan status "Menunggu Verifikasi"                                                                      |
|                                                                                                 | 9. Sistem mengubah status barang temuan menjadi "Diklaim"                                                                          |
|                                                                                                 | 10. Sistem mengirim notifikasi email kepada petugas bahwa ada klaim baru yang perlu diverifikasi                                   |
|                                                                                                 | 11. Sistem menampilkan pesan sukses kepada user dan mengarahkan ke halaman "Klaim Saya"                                            |
| **Proses Verifikasi oleh Petugas:**                                                             |                                                                                                                                    |
| 12. Petugas login dan melihat notifikasi klaim baru di dashboard                                |                                                                                                                                    |
| 13. Petugas memilih menu "Verifikasi Klaim"                                                     |                                                                                                                                    |
|                                                                                                 | 14. Sistem menampilkan daftar semua klaim yang menunggu verifikasi                                                                 |
| 15. Petugas mengklik detail klaim untuk review                                                  |                                                                                                                                    |
|                                                                                                 | 16. Sistem menampilkan informasi lengkap: data pengklaim, bukti kepemilikan, foto barang temuan, dan laporan kehilangan (jika ada) |
| 17. Petugas memverifikasi identitas dan bukti kepemilikan, lalu memilih "Approve" atau "Reject" |                                                                                                                                    |
|                                                                                                 | 18. Jika Approve: Sistem mengubah status klaim menjadi "Disetujui", status barang menjadi "Akan Diambil"                           |
|                                                                                                 | 19. Jika Reject: Sistem mengubah status klaim menjadi "Ditolak", status barang kembali "Tersedia"                                  |
|                                                                                                 | 20. Sistem mengirim notifikasi email kepada user tentang hasil verifikasi                                                          |
|                                                                                                 | 21. Sistem mencatat aktivitas verifikasi dalam log                                                                                 |
| 22. Setelah barang diambil, petugas mengubah status barang menjadi "Sudah Diambil"              |                                                                                                                                    |
|                                                                                                 | 23. Sistem mengupdate status dan mencatat tanggal pengambilan                                                                      |

### 4.5.3 Activity Diagram

```
[Start] → [User Login] → [Pilih Menu Barang Temuan]
    → [Tampilkan Daftar Barang Tersedia] → [User Filter/Search]
    → [User Klik Detail Barang] → [Tampilkan Detail Lengkap]
    → [User Klik "Klaim Barang Ini"] → [Tampilkan Form Klaim]
    → [User Isi Form Bukti Kepemilikan] → [Submit Klaim]
    → [Simpan Klaim: Status "Menunggu Verifikasi"]
    → [Update Status Barang: "Diklaim"]
    → [Kirim Notifikasi ke Petugas] → [Tampilkan Pesan Sukses ke User]

[Petugas Login] → [Lihat Notifikasi Klaim Baru]
    → [Pilih Menu Verifikasi Klaim] → [Tampilkan Daftar Klaim]
    → [Petugas Klik Detail Klaim] → [Tampilkan Info Lengkap]
    → [Petugas Verifikasi] → {Keputusan?}
        → [Approve] → [Update Status Klaim: "Disetujui"]
            → [Update Status Barang: "Akan Diambil"]
            → [Kirim Notifikasi Approve ke User]
            → [Log Aktivitas] → [End]
        → [Reject] → [Update Status Klaim: "Ditolak"]
            → [Update Status Barang: "Tersedia"]
            → [Kirim Notifikasi Reject ke User]
            → [Log Aktivitas] → [End]

[Setelah Pengambilan] → [Petugas Update Status: "Sudah Diambil"]
    → [Catat Tanggal Pengambilan] → [End]
```

## 4.6 Use Case: Manajemen User dan Petugas (Admin)

### 4.6.1 Deskripsi Use Case

Use case ini menjelaskan proses administrator dalam mengelola akun user (civitas akademika) dan akun petugas (satpam). Admin dapat melihat daftar, menambah, mengedit, menonaktifkan, atau menghapus akun user dan petugas dalam sistem.

### 4.6.2 Stimulus and Response

| Action by User                                                                                   | Response from System                                                                                               |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Mengelola User:**                                                                              |                                                                                                                    |
| 1. Admin login dan memilih menu "Kelola User"                                                    |                                                                                                                    |
|                                                                                                  | 2. Sistem menampilkan tabel daftar user dengan kolom: ID, Nama, Email, Role, Status, Tanggal Registrasi, dan Aksi  |
| 3. Admin dapat menggunakan filter atau search untuk menemukan user tertentu                      |                                                                                                                    |
|                                                                                                  | 4. Sistem memfilter dan menampilkan hasil                                                                          |
| 5. Admin memilih aksi: Lihat Detail, Edit, Nonaktifkan, atau Hapus                               |                                                                                                                    |
|                                                                                                  | 6. Jika Edit: Sistem menampilkan form edit dengan data user yang dapat diubah (nama, email, nomor telepon, status) |
| 7. Admin mengubah data dan menyimpan                                                             |                                                                                                                    |
|                                                                                                  | 8. Sistem memvalidasi dan menyimpan perubahan ke database                                                          |
|                                                                                                  | 9. Sistem mengirim email notifikasi kepada user tentang perubahan akun (jika signifikan)                           |
|                                                                                                  | 10. Sistem mencatat aktivitas admin dalam audit log                                                                |
| 11. Jika Nonaktifkan: Admin mengkonfirmasi aksi                                                  |                                                                                                                    |
|                                                                                                  | 12. Sistem mengubah status user menjadi "Inactive" dan user tidak dapat login                                      |
| 13. Jika Hapus: Admin mengkonfirmasi penghapusan                                                 |                                                                                                                    |
|                                                                                                  | 14. Sistem menghapus user dan semua data terkait (setelah konfirmasi ulang)                                        |
| 15. Admin dapat menambah user baru secara manual dengan mengisi form pendaftaran                 |                                                                                                                    |
|                                                                                                  | 16. Sistem membuat akun user baru dan mengirim email kredensial                                                    |
| **Mengelola Petugas:**                                                                           |                                                                                                                    |
| 17. Admin memilih menu "Kelola Petugas"                                                          |                                                                                                                    |
|                                                                                                  | 18. Sistem menampilkan tabel daftar petugas dengan informasi lengkap                                               |
| 19. Admin dapat menambah petugas baru                                                            |                                                                                                                    |
|                                                                                                  | 20. Sistem menampilkan form tambah petugas dengan field: nama, email, password, nomor telepon, shift kerja         |
| 21. Admin mengisi form dan submit                                                                |                                                                                                                    |
|                                                                                                  | 22. Sistem membuat akun petugas dengan role "Petugas"                                                              |
|                                                                                                  | 23. Sistem mengirim email kredensial login ke petugas                                                              |
| 24. Admin dapat mengedit atau menghapus akun petugas dengan proses serupa seperti mengelola user |                                                                                                                    |
|                                                                                                  | 25. Sistem mengupdate data dan mencatat dalam audit log                                                            |

### 4.6.3 Activity Diagram

```
[Start] → [Admin Login] → [Pilih Menu] → {Menu?}

    → [Kelola User] → [Tampilkan Tabel User]
        → [Admin Filter/Search] → [Tampilkan Hasil]
        → [Admin Pilih Aksi] → {Aksi?}
            → [Lihat Detail] → [Tampilkan Info User] → [End]
            → [Edit] → [Tampilkan Form Edit] → [Admin Update Data]
                → [Validasi] → [Simpan ke Database]
                → [Kirim Notifikasi ke User (jika perlu)]
                → [Log Aktivitas] → [End]
            → [Nonaktifkan] → [Konfirmasi] → {Ya?}
                → [Yes] → [Update Status: Inactive] → [Log Aktivitas] → [End]
                → [No] → [Batal] → [End]
            → [Hapus] → [Konfirmasi Hapus] → {Ya?}
                → [Yes] → [Hapus User & Data Terkait] → [Log Aktivitas] → [End]
                → [No] → [Batal] → [End]
            → [Tambah User Baru] → [Tampilkan Form Registrasi]
                → [Admin Isi Form] → [Buat Akun Baru]
                → [Kirim Email Kredensial] → [End]

    → [Kelola Petugas] → [Tampilkan Tabel Petugas]
        → [Admin Pilih Aksi] → {Aksi?}
            → [Tambah Petugas] → [Tampilkan Form Tambah]
                → [Admin Isi Data Petugas] → [Submit]
                → [Buat Akun Petugas dengan Role "Petugas"]
                → [Kirim Email Kredensial] → [Log Aktivitas] → [End]
            → [Edit/Hapus] → [Proses Serupa dengan User] → [End]
```

## 4.7 Use Case: Laporan dan Export Data (Admin)

### 4.7.1 Deskripsi Use Case

Use case ini menjelaskan proses administrator dalam melihat semua data laporan (barang hilang, barang temuan, klaim terverifikasi) dan mengekspor data tersebut dalam berbagai format untuk keperluan arsip, evaluasi, dan pelaporan.

### 4.7.2 Stimulus and Response

| Action by User                                       | Response from System                                                                                                                                                                            |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Admin login dan memilih menu "Laporan Kehilangan" |                                                                                                                                                                                                 |
|                                                      | 2. Sistem menampilkan tabel semua laporan kehilangan dengan filter kategori, status, tanggal, dan pencarian                                                                                     |
| 3. Admin dapat melihat detail setiap laporan         |                                                                                                                                                                                                 |
|                                                      | 4. Sistem menampilkan informasi lengkap laporan termasuk foto dan data pelapor                                                                                                                  |
| 5. Admin memilih menu "Barang Temuan"                |                                                                                                                                                                                                 |
|                                                      | 6. Sistem menampilkan semua barang temuan yang telah diunggah oleh petugas dengan filter serupa                                                                                                 |
| 7. Admin memilih menu "Verifikasi Klaim"             |                                                                                                                                                                                                 |
|                                                      | 8. Sistem menampilkan semua klaim dengan status: Menunggu, Disetujui, Ditolak, Sudah Diambil                                                                                                    |
| 9. Admin memilih menu "Export Data"                  |                                                                                                                                                                                                 |
|                                                      | 10. Sistem menampilkan opsi export dengan pilihan: Tipe data (Laporan Hilang, Barang Temuan, Klaim, Semua), Format (PDF, Excel, CSV), Rentang tanggal                                           |
| 11. Admin memilih opsi dan klik "Generate Report"    |                                                                                                                                                                                                 |
|                                                      | 12. Sistem memproses data sesuai filter yang dipilih                                                                                                                                            |
|                                                      | 13. Sistem membuat file laporan dalam format yang dipilih dengan struktur yang terorganisir                                                                                                     |
|                                                      | 14. Sistem menyediakan link download file                                                                                                                                                       |
| 15. Admin mengklik download                          |                                                                                                                                                                                                 |
|                                                      | 16. Sistem mendownload file ke perangkat admin                                                                                                                                                  |
|                                                      | 17. Sistem mencatat aktivitas export dalam audit log                                                                                                                                            |
| 18. Admin memilih menu "Dashboard Analytics"         |                                                                                                                                                                                                 |
|                                                      | 19. Sistem menampilkan statistik lengkap: Total barang hilang, Total barang temuan, Tingkat keberhasilan klaim, Grafik tren per bulan, Kategori terpopuler, User paling aktif, Performa petugas |

### 4.7.3 Activity Diagram

```
[Start] → [Admin Login] → [Pilih Menu Laporan] → {Menu?}

    → [Laporan Kehilangan] → [Tampilkan Tabel Laporan Hilang]
        → [Admin Filter/Search] → [Tampilkan Hasil]
        → [Admin Klik Detail] → [Tampilkan Info Lengkap] → [End]

    → [Barang Temuan] → [Tampilkan Tabel Barang Temuan]
        → [Admin Filter] → [Lihat Detail Barang] → [End]

    → [Verifikasi Klaim] → [Tampilkan Semua Klaim]
        → [Admin Filter Status] → [Lihat Detail Klaim] → [End]

    → [Export Data] → [Tampilkan Opsi Export]
        → [Admin Pilih: Tipe Data, Format, Rentang Tanggal]
        → [Klik Generate Report] → [Proses Data Sesuai Filter]
        → [Buat File Laporan] → {Format?}
            → [PDF] → [Generate PDF] → [Tampilkan Link Download]
            → [Excel] → [Generate Excel] → [Tampilkan Link Download]
            → [CSV] → [Generate CSV] → [Tampilkan Link Download]
        → [Admin Klik Download] → [Download File]
        → [Log Aktivitas Export] → [End]

    → [Dashboard Analytics] → [Generate Statistik]
        → [Tampilkan Dashboard dengan:]
            → [Total Barang Hilang]
            → [Total Barang Temuan]
            → [Tingkat Keberhasilan Klaim]
            → [Grafik Tren per Bulan]
            → [Kategori Terpopuler]
            → [User Paling Aktif]
            → [Performa Petugas]
        → [End]
```

## 4.8 Class Diagram

```
+-------------------+          +-------------------+          +-------------------+
|      User         |          |      Petugas      |          |   Administrator   |
+-------------------+          +-------------------+          +-------------------+
| - userId: int     |          | - petugasId: int  |          | - adminId: int    |
| - name: string    |          | - name: string    |          | - name: string    |
| - email: string   |          | - email: string   |          | - email: string   |
| - password: string|          | - password: string|          | - password: string|
| - phoneNumber:str |          | - phoneNumber:str |          | - role: string    |
| - profilePhoto:str|          | - shiftKerja: str |          | - createdAt: date |
| - role: string    |          | - status: string  |          +-------------------+
| - createdAt: date |          | - createdAt: date |          | + login()         |
| - isVerified: bool|          +-------------------+          | + manageUser()    |
| - status: string  |          | + login()         |          | + managePetugas() |
+-------------------+          | + uploadBarang()  |          | + viewAllLaporan()|
| + register()      |          | + kelolaBa rang() |          | + exportData()    |
| + login()         |          | + verifikasiKlaim()|         | + viewStatistics()|
| + updateProfile() |          | + lihatLaporan()  |          +-------------------+
| + laporkanHilang()|          +-------------------+
| + klaimBarang()   |                   |
| + lihatBarangTem()|                   |
+-------------------+                   |
         |                              |
         | 1..*                         | 1..*
         |                              |
         v                              v
+-------------------+          +-------------------+
|  LaporanHilang    |          |   BarangTemuan    |
+-------------------+          +-------------------+
| - laporanId: int  |          | - barangId: int   |
| - userId: int(FK) |          | - petugasId: int(FK)|
| - namaBarang: str |          | - namaBarang: str |
| - kategoriId: int(FK)|       | - kategoriId: int(FK)|
| - deskripsi: text |          | - deskripsi: text |
| - lokasi: string  |          | - lokasi: string  |
| - tanggal: date   |          | - tanggal: date   |
| - status: string  |          | - kondisi: string |
| - kontakInfo: str |          | - tempatSimpan:str|
| - createdAt: date |          | - status: string  |
| - updatedAt: date |          | - createdAt: date |
+-------------------+          | - updatedAt: date |
| + createLaporan() |          +-------------------+
| + updateLaporan() |          | + uploadBarang()  |
| + deleteLaporan() |          | + updateBarang()  |
| + changeStatus()  |          | + deleteBarang()  |
+-------------------+          | + changeStatus()  |
         |                     +-------------------+
         | 1..*                         |
         |                              | 1..*
         v                              v
+-------------------+          +-------------------+
|       Foto        |          |       Foto        |
+-------------------+          +-------------------+
| - fotoId: int     |          | - fotoId: int     |
| - laporanId: int(FK)|        | - barangId: int(FK)|
| - fileName: string|          | - fileName: string|
| - filePath: string|          | - filePath: string|
| - fileSize: int   |          | - fileSize: int   |
| - uploadDate: date|          | - uploadDate: date|
+-------------------+          +-------------------+
| + uploadFoto()    |          | + uploadFoto()    |
| + deleteFoto()    |          | + deleteFoto()    |
+-------------------+          +-------------------+

+-------------------+
|    Kategori       |
+-------------------+
| - kategoriId: int |
| - namaKategori:str|
| - deskripsi: text |
+-------------------+
| + getAllKategori()|
| + addKategori()   |
| + deleteKategori()|
+-------------------+
         ^
         |
         | (reference)
         |
   LaporanHilang
   BarangTemuan

+----------------------------+
|        KlaimBarang         |
+----------------------------+
| - klaimId: int             |
| - userId: int (FK)         |
| - barangId: int (FK)       |
| - buktiKepemilikan: text   |
| - fotoBukti: string        |
| - statusKlaim: string      |
| - petugasVerifikasi:int(FK)|
| - tanggalKlaim: date       |
| - tanggalVerifikasi: date  |
| - catatanVerifikasi: text  |
| - tanggalPengambilan: date |
+----------------------------+
| + createKlaim()            |
| + verifikasiKlaim()        |
| + updateStatus()           |
| + getCatatanVerifikasi()   |
+----------------------------+
         |
         | many-to-one
         v
      User, BarangTemuan, Petugas

+-------------------+
|    Notifikasi     |
+-------------------+
| - notifId: int    |
| - userId: int(FK) |
| - message: text   |
| - type: string    |
| - relatedId: int  |
| - isRead: boolean |
| - createdAt: date |
+-------------------+
| + sendNotifikasi()|
| + markAsRead()    |
| + deleteNotifikasi|
+-------------------+
         ^
         |
    User | 1..*

+-------------------+
|    AuditLog       |
+-------------------+
| - logId: int      |
| - adminId: int(FK)|
| - action: string  |
| - targetType: str |
| - targetId: int   |
| - description: txt|
| - timestamp: date |
+-------------------+
| + createLog()     |
| + getLogs()       |
| + filterByDate()  |
+-------------------+
```

**Penjelasan Relationship:**

- User memiliki relasi one-to-many dengan LaporanHilang (satu user dapat membuat banyak laporan kehilangan)
- User memiliki relasi one-to-many dengan KlaimBarang (satu user dapat mengajukan banyak klaim)
- Petugas memiliki relasi one-to-many dengan BarangTemuan (satu petugas dapat upload banyak barang temuan)
- Petugas memiliki relasi one-to-many dengan KlaimBarang untuk verifikasi (satu petugas dapat memverifikasi banyak klaim)
- LaporanHilang dan BarangTemuan masing-masing memiliki relasi one-to-many dengan Foto
- LaporanHilang dan BarangTemuan memiliki relasi many-to-one dengan Kategori
- KlaimBarang menghubungkan User dengan BarangTemuan dalam relasi many-to-many
- User memiliki relasi one-to-many dengan Notifikasi
- Administrator memiliki relasi one-to-many dengan AuditLog
- Kategori dapat dikelola oleh Administrator

---

# 5. Non Functional Requirements

| ID      | Parameter                   | Kebutuhan                                                                                                                                                                                           |
| ------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-001 | Availability                | Aplikasi harus tersedia 99% dari waktu operasional (24/7), dengan downtime maksimal 7 jam per bulan untuk maintenance terjadwal                                                                     |
| NFR-002 | Reliability                 | Sistem harus memiliki tingkat kegagalan maksimal 0.1% untuk operasi critical (login, submit laporan, upload barang, verifikasi klaim). Implementasi backup otomatis harian untuk data               |
| NFR-003 | Performance - Response Time | Halaman utama harus dimuat dalam waktu maksimal 2 detik. Upload barang temuan maksimal 5 detik per file. Proses verifikasi klaim maksimal 3 detik. Export data maksimal 10 detik untuk 1000 records |
| NFR-004 | Performance - Throughput    | Sistem harus mampu menangani minimal 500 concurrent users (user, petugas, admin) tanpa degradasi performa signifikan                                                                                |
| NFR-005 | Scalability                 | Arsitektur sistem harus dapat ditingkatkan kapasitasnya (scale up/scale out) untuk menangani pertumbuhan hingga 10,000 users, 100 petugas, dan 50 admin                                             |
| NFR-006 | Usability - Ergonomy        | Interface harus intuitif dengan maksimal 3 klik untuk mengakses fitur utama. Tersedia panduan visual (tooltip, helper text) di setiap form. Dashboard disesuaikan per role (User, Petugas, Admin)   |
| NFR-007 | Usability - Accessibility   | Aplikasi harus memenuhi standar WCAG 2.1 Level AA untuk aksesibilitas (contrast ratio, keyboard navigation, screen reader support)                                                                  |
| NFR-008 | Portability                 | Aplikasi harus dapat diakses dan berfungsi dengan baik di berbagai browser (Chrome, Firefox, Safari, Edge) dan berbagai ukuran layar (responsive design)                                            |
| NFR-009 | Security - Authentication   | Implementasi autentikasi yang aman menggunakan password hashing (bcrypt) dengan minimum 8 karakter termasuk huruf besar, kecil, dan angka. Multi-role authentication (User, Petugas, Admin)         |
| NFR-010 | Security - Authorization    | Role-based access control (RBAC) dengan 3 level: User (akses terbatas untuk laporan dan klaim), Petugas (akses penuh untuk barang temuan dan verifikasi), Admin (full access)                       |
| NFR-011 | Security - Data Protection  | Semua komunikasi harus menggunakan HTTPS/TLS 1.2+. Data sensitif (password, informasi pribadi) harus dienkripsi di database                                                                         |
| NFR-012 | Security - Input Validation | Semua input user, petugas, dan admin harus divalidasi dan disanitasi untuk mencegah SQL Injection, XSS, dan CSRF attacks                                                                            |
| NFR-013 | Memory                      | Konsumsi memory di client-side maksimal 200 MB untuk menghindari lag pada perangkat dengan spesifikasi rendah                                                                                       |
| NFR-014 | Storage                     | Sistem penyimpanan harus dapat menampung minimal 10,000 laporan kehilangan, 5,000 barang temuan, dan 15,000 foto (total ~200 GB)                                                                    |
| NFR-015 | Database Performance        | Query database harus dioptimasi dengan indexing yang tepat. Query kompleks (join multi-table untuk laporan) maksimal 1 detik untuk eksekusi                                                         |
| NFR-016 | Maintainability             | Kode harus mengikuti coding standards dengan dokumentasi lengkap. Modular architecture untuk memudahkan maintenance dan penambahan fitur. Separation of concerns untuk role-based features          |
| NFR-017 | Bahasa Komunikasi           | Semua teks interface, notifikasi, dan dokumentasi harus dalam Bahasa Indonesia yang baku dan mudah dipahami                                                                                         |
| NFR-018 | Branding                    | Setiap halaman harus menampilkan logo UIN Sunan Kalijaga Yogyakarta dan mengikuti color scheme identitas kampus (hijau dan putih)                                                                   |
| NFR-019 | Data Backup                 | Backup database otomatis setiap hari pukul 02:00 WIB dengan retention period 30 hari. Backup terpisah untuk data user, petugas, laporan, dan klaim                                                  |
| NFR-020 | Error Handling              | Sistem harus menampilkan pesan error yang user-friendly dan role-specific (tidak menampilkan technical error). Log error detail disimpan untuk debugging                                            |
| NFR-021 | Notification Delivery       | Email notifikasi harus terkirim dalam waktu maksimal 5 menit setelah event trigger (klaim baru, verifikasi selesai, perubahan status)                                                               |
| NFR-022 | Data Retention              | Laporan dengan status "Closed" dan klaim "Sudah Diambil" akan diarsipkan setelah 6 bulan dan dapat dihapus setelah 1 tahun                                                                          |
| NFR-023 | Compatibility               | Aplikasi harus kompatibel dengan browser versi terbaru dan 2 versi sebelumnya                                                                                                                       |
| NFR-024 | Legal Compliance            | Sistem harus mematuhi regulasi perlindungan data pribadi (UU ITE dan kebijakan privasi kampus)                                                                                                      |
| NFR-025 | Monitoring                  | Implementasi system monitoring untuk tracking uptime, response time, error rate, dan aktivitas per role (user, petugas, admin)                                                                      |
| NFR-026 | Audit Trail                 | Sistem harus mencatat semua aktivitas critical: login, create/update/delete laporan, verifikasi klaim, perubahan user/petugas oleh admin, export data                                               |
| NFR-027 | Export Performance          | Export data harus dapat menghasilkan file PDF/Excel/CSV dengan maksimal 10,000 records dalam waktu kurang dari 30 detik                                                                             |
| NFR-028 | Session Management          | Session timeout 30 menit untuk user, 60 menit untuk petugas, 120 menit untuk admin. Auto-save untuk form yang sedang diisi                                                                          |
| NFR-029 | Concurrent Verification     | Sistem harus menangani verifikasi klaim concurrent oleh multiple petugas dengan locking mechanism untuk mencegah double-approval                                                                    |
| NFR-030 | Data Integrity              | Sistem harus memastikan integritas referensial antara User-LaporanHilang, Petugas-BarangTemuan, User-KlaimBarang, dan Petugas-Verifikasi dengan proper foreign key constraints                      |

---

## Catatan Penutup

Dokumen Software Requirements Specification (SRS) untuk aplikasi "Suka Kehilangan" ini telah disusun secara komprehensif mencakup seluruh aspek fungsional dan non-fungsional yang diperlukan untuk pengembangan sistem. Dokumen ini akan menjadi acuan utama bagi tim pengembang, penguji, dan stakeholder dalam proses pembangunan dan implementasi aplikasi.

Setiap perubahan atau penambahan requirement harus didokumentasikan dalam Revision History dan dikomunikasikan kepada seluruh pihak terkait untuk memastikan sinkronisasi pemahaman dan ekspektasi.

**Persetujuan:**

| Role                       | Nama | Tanda Tangan | Tanggal |
| -------------------------- | ---- | ------------ | ------- |
| Project Manager            |      |              |         |
| Lead Developer             |      |              |         |
| Stakeholder (Pihak Kampus) |      |              |         |

---

**Document Version:** 1.0  
**Last Updated:** <date created>  
**Next Review Date:** <date + 3 months>
