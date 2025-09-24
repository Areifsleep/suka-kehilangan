Tentu, untuk mendukung unggahan banyak gambar per laporan menggunakan _presigned URL_ S3, Anda perlu membuat satu tabel baru bernama `report_images`.

Tabel ini akan memiliki hubungan **satu-ke-banyak** dengan tabel `reports` Anda—satu laporan bisa memiliki banyak gambar.

---

### Desain Tabel Baru: `report_images`

Tabel ini berfungsi untuk menyimpan referensi ke setiap file gambar yang berhasil diunggah ke S3 untuk sebuah laporan.

| Nama Kolom           | Tipe Data (Saran) | Keterangan                                                                             |
| :------------------- | :---------------- | :------------------------------------------------------------------------------------- |
| **`id`** (PK)        | `BIGINT`          | Primary Key, Auto Increment.                                                           |
| **`report_id`** (FK) | `BIGINT`          | Foreign Key yang merujuk ke `reports.id`. **Wajib diindeks**.                          |
| **`storage_key`**    | `VARCHAR(255)`    | **Kolom Kunci**. Menyimpan path unik file di S3 (contoh: `reports/uuid-filename.jpg`). |
| `original_filename`  | `VARCHAR(255)`    | Nama asli file yang diunggah oleh pengguna.                                            |
| `file_size`          | `INTEGER`         | Ukuran file dalam bytes. Berguna untuk validasi.                                       |
| `mime_type`          | `VARCHAR(100)`    | Tipe media file (contoh: `image/jpeg`).                                                |
| `is_primary`         | `BOOLEAN`         | (Opsional) Penanda jika gambar ini adalah gambar utama/thumbnail untuk laporan.        |
| `created_at`         | `TIMESTAMP`       | Waktu data dibuat.                                                                     |

Anda **tidak menyimpan _presigned URL_** di database karena URL tersebut bersifat sementara dan hanya digunakan untuk proses unggah. Yang Anda simpan adalah `storage_key` yang permanen.

---

### Alur Kerja dengan Desain Ini

Berikut adalah bagaimana alur kerja aplikasi Anda akan berinteraksi dengan database dan S3:

1.  **Request Upload**: Pengguna memilih 3 gambar di aplikasi dan menekan tombol "upload". Aplikasi Anda mengirim permintaan ke server, memberitahukan niat untuk mengunggah 3 file untuk `report_id` tertentu.

2.  **Generate Presigned URLs**: Server Anda menerima permintaan, kemudian berkomunikasi dengan AWS S3 SDK untuk membuat **3 _presigned URL_** yang unik untuk proses `PUT Object`. Setiap URL ini memiliki masa berlaku singkat (misalnya 5-15 menit). Server juga membuat `storage_key` unik untuk setiap file.

3.  **Upload Langsung ke S3**: Server mengirim kembali 3 _presigned URL_ dan `storage_key` terkait ke aplikasi klien. Aplikasi klien kemudian langsung mengunggah file gambar ke S3 menggunakan URL tersebut, satu per satu. Ini meringankan beban server Anda.

4.  **Konfirmasi Upload**: Setelah ketiga file berhasil diunggah ke S3, aplikasi klien mengirim permintaan terakhir ke server Anda yang berisi daftar `storage_key` yang berhasil diunggah.

5.  **Simpan ke Database**: Server menerima konfirmasi ini, lalu menyimpan informasi ke tabel `report_images`. Akan ada **3 baris data baru** yang dibuat, masing-masing dengan `report_id` yang sama tetapi `storage_key` yang berbeda.

Dengan desain ini, database Anda secara efisien mendukung hubungan antara laporan dan banyak gambar, sambil memanfaatkan keamanan dan skalabilitas unggahan langsung ke S3 menggunakan _presigned URLs_.
