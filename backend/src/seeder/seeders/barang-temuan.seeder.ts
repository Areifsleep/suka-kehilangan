import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatusBarang } from '@prisma/client';

@Injectable()
export class BarangTemuanSeeder {
  private readonly logger = new Logger(BarangTemuanSeeder.name);

  constructor(private readonly prismaService: PrismaService) {}

  async run(): Promise<void> {
    this.logger.log('Seeding data barang temuan...');

    try {
      // Get existing users (petugas) and categories
      const petugas = await this.prismaService.user.findMany({
        where: {
          role: {
            name: 'PETUGAS',
          },
        },
        take: 3,
      });

      const categories = await this.prismaService.kategoriBarang.findMany();

      if (petugas.length === 0 || categories.length === 0) {
        this.logger.warn(
          'Tidak ada petugas atau kategori, skip seeding barang temuan',
        );
        return;
      }

      // Sample barang temuan data
      const barangTemuanData = [
        {
          nama_barang: 'iPhone 13 Pro Max',
          deskripsi:
            'iPhone 13 Pro Max warna biru dengan casing hitam. Kondisi baik, layar tidak retak. Ditemukan dalam keadaan mati (baterai habis).',
          lokasi_umum: 'Lantai 2',
          lokasi_spesifik: 'Ruang tunggu depan lift',
          tanggal_ditemukan: new Date('2024-12-05'),
          perkiraan_waktu_ditemukan: '10:00 - 11:00 WIB',
          nama_penemu: 'Ahmad Fauzi',
          nomor_hp_penemu: '081234567890',
          identitas_penemu: 'H07123456',
          email_penemu: 'ahmad.fauzi@student.unhas.ac.id',
          catatan_penemu:
            'Ditemukan tergeletak di meja tunggu dekat lift. HP dalam kondisi mati.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Elektronik')?.id,
          pencatat_id: petugas[0].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1592286927505-c0d8e6b9f7e5?w=800',
              nama_file_asli: 'iphone_depan.jpg',
              mime_type: 'image/jpeg',
            },
            {
              url_gambar:
                'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800',
              nama_file_asli: 'iphone_belakang.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Dompet Kulit Coklat',
          deskripsi:
            'Dompet kulit warna coklat tua merek Bellroy. Berisi KTM, uang tunai Rp 500.000, dan beberapa kartu ATM.',
          lokasi_umum: 'Area Wudhu',
          lokasi_spesifik: 'Dekat tempat sandal laki-laki',
          tanggal_ditemukan: new Date('2024-12-06'),
          perkiraan_waktu_ditemukan: '12:30 - 13:00 WIB',
          nama_penemu: 'Budi Santoso',
          nomor_hp_penemu: '082345678901',
          identitas_penemu: '7371012345678901',
          catatan_penemu: 'Ketinggalan di area wudhu saat sholat dzuhur.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Dompet')?.id,
          pencatat_id: petugas[1].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
              nama_file_asli: 'dompet_depan.jpg',
              mime_type: 'image/jpeg',
            },
            {
              url_gambar:
                'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
              nama_file_asli: 'dompet_isi.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Tas Ransel Eiger Hitam',
          deskripsi:
            'Tas ransel merek Eiger warna hitam ukuran sedang. Berisi buku kuliah, laptop Asus ROG, dan alat tulis.',
          lokasi_umum: 'Lantai 3',
          lokasi_spesifik: 'Meja baca nomor 15',
          tanggal_ditemukan: new Date('2024-12-07'),
          perkiraan_waktu_ditemukan: '16:00 - 17:00 WIB',
          nama_penemu: 'Siti Nurhaliza',
          nomor_hp_penemu: '083456789012',
          identitas_penemu: 'H07234567',
          email_penemu: 'siti.nurhaliza@student.unhas.ac.id',
          catatan_penemu:
            'Tas tertinggal di meja baca lantai 3. Ditemukan saat jam tutup perpustakaan.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Tas')?.id,
          pencatat_id: petugas[0].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
              nama_file_asli: 'tas_depan.jpg',
              mime_type: 'image/jpeg',
            },
            {
              url_gambar:
                'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800',
              nama_file_asli: 'tas_isi.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Kunci Motor Honda Beat',
          deskripsi:
            'Kunci motor Honda Beat dengan gantungan karakter Doraemon. Ada remote alarm warna hitam.',
          lokasi_umum: 'Blok A',
          lokasi_spesifik: 'Dekat pintu masuk parkir',
          tanggal_ditemukan: new Date('2024-12-06'),
          perkiraan_waktu_ditemukan: '14:00 - 15:00 WIB',
          nama_penemu: 'Andi Wijaya',
          nomor_hp_penemu: '084567890123',
          identitas_penemu: '198505152010011001',
          catatan_penemu: 'Kunci terjatuh di area parkir motor.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Kunci')?.id,
          pencatat_id: petugas[2].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800',
              nama_file_asli: 'kunci_motor.jpg',
              mime_type: 'image/jpeg',
            },
            {
              url_gambar:
                'https://images.unsplash.com/photo-1614030424754-24d0eebd46b2?w=800',
              nama_file_asli: 'kunci_gantungan.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'KTM (Kartu Tanda Mahasiswa)',
          deskripsi:
            'KTM atas nama Rizki Ramadhan, NIM H07345678, Jurusan Teknik Informatika angkatan 2021.',
          lokasi_umum: 'Meja makan',
          lokasi_spesifik: 'Meja nomor 8 dekat jendela',
          tanggal_ditemukan: new Date('2024-12-07'),
          perkiraan_waktu_ditemukan: '12:00 - 13:00 WIB',
          nama_penemu: 'Dewi Lestari',
          nomor_hp_penemu: '085678901234',
          identitas_penemu: 'H07456789',
          email_penemu: 'dewi.lestari@student.unhas.ac.id',
          catatan_penemu: 'KTM tertinggal di meja kantin setelah makan siang.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Dokumen')?.id,
          pencatat_id: petugas[1].id,
          foto_barang: [
            {
              url_gambar:
                'https://via.placeholder.com/800x600/1976D2/FFFFFF?text=KTM+Depan+-+Rizki+Ramadhan',
              nama_file_asli: 'ktm_depan.jpg',
              mime_type: 'image/jpeg',
            },
            {
              url_gambar:
                'https://via.placeholder.com/800x600/1976D2/FFFFFF?text=KTM+Belakang',
              nama_file_asli: 'ktm_belakang.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Laptop MacBook Air M1',
          deskripsi:
            'MacBook Air M1 2020 warna silver. Ada stiker Apple Developer di bagian belakang. Kondisi baik, lengkap dengan charger.',
          lokasi_umum: 'Gedung C Lantai 3',
          lokasi_spesifik: 'Meja paling depan dekat papan tulis',
          tanggal_ditemukan: new Date('2024-12-05'),
          perkiraan_waktu_ditemukan: '15:00 - 16:00 WIB',
          nama_penemu: 'Muhammad Rizal',
          nomor_hp_penemu: '086789012345',
          identitas_penemu: '198512122015011002',
          catatan_penemu:
            'Laptop tertinggal setelah kelas selesai. Ditemukan oleh dosen.',
          status: StatusBarang.SUDAH_DIAMBIL,
          waktu_diambil: new Date('2024-12-06T10:30:00'),
          nama_pengambil: 'Fajar Pradana',
          identitas_pengambil: 'H07567890',
          kontak_pengambil: '087890123456',
          keterangan_klaim:
            'Pemilik menunjukkan foto laptop yang sama, KTM, dan bisa membuka password MacBook. Verifikasi berhasil.',
          kategori_id: categories.find((c) => c.nama === 'Elektronik')?.id,
          pencatat_id: petugas[0].id,
          penyerah_id: petugas[1].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
              nama_file_asli: 'macbook_depan.jpg',
              mime_type: 'image/jpeg',
            },
            {
              url_gambar:
                'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
              nama_file_asli: 'macbook_belakang.jpg',
              mime_type: 'image/jpeg',
            },
          ],
          foto_bukti_klaim: [
            {
              url_gambar:
                'https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=KTM+Fajar+Pradana',
              nama_file_asli: 'ktm_fajar.jpg',
              mime_type: 'image/jpeg',
            },
            {
              url_gambar:
                'https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=Bukti+Kepemilikan',
              nama_file_asli: 'invoice_macbook.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Smartwatch Samsung Galaxy Watch 5',
          deskripsi:
            'Samsung Galaxy Watch 5 warna hitam ukuran 44mm. Kondisi baik, masih menyala dengan baterai 30%.',
          lokasi_umum: 'Area Olahraga',
          lokasi_spesifik: 'Pinggir lapangan dekat bangku penonton',
          tanggal_ditemukan: new Date('2024-12-07'),
          perkiraan_waktu_ditemukan: '17:00 - 18:00 WIB',
          nama_penemu: 'Eko Prasetyo',
          nomor_hp_penemu: '088901234567',
          identitas_penemu: 'H07678901',
          catatan_penemu:
            'Smartwatch ditemukan di pinggir lapangan setelah pertandingan basket.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Elektronik')?.id,
          pencatat_id: petugas[2].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
              nama_file_asli: 'smartwatch_depan.jpg',
              mime_type: 'image/jpeg',
            },
            {
              url_gambar:
                'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800',
              nama_file_asli: 'smartwatch_samping.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Kacamata Ray-Ban Original',
          deskripsi:
            'Kacamata Ray-Ban Aviator warna gold dengan lensa coklat. Kondisi sangat baik, ada case nya.',
          lokasi_umum: 'Lantai 1',
          lokasi_spesifik: 'Kursi baris ke-5 dari depan',
          tanggal_ditemukan: new Date('2024-12-06'),
          perkiraan_waktu_ditemukan: '19:00 - 20:00 WIB',
          nama_penemu: 'Fitri Handayani',
          nomor_hp_penemu: '089012345678',
          identitas_penemu: 'H07789012',
          email_penemu: 'fitri.handayani@student.unhas.ac.id',
          catatan_penemu:
            'Kacamata tertinggal di kursi setelah acara seminar selesai.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Aksesoris')?.id,
          pencatat_id: petugas[0].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
              nama_file_asli: 'kacamata_aviator.jpg',
              mime_type: 'image/jpeg',
            },
            {
              url_gambar:
                'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800',
              nama_file_asli: 'kacamata_case.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Charger Laptop HP Original',
          deskripsi:
            'Charger laptop HP original 65W dengan kabel sepanjang 1.8 meter. Kondisi baik, tidak ada kerusakan.',
          lokasi_umum: 'Geduk F Lantai 2',
          lokasi_spesifik: 'Meja komputer nomor 12',
          tanggal_ditemukan: new Date('2024-12-05'),
          perkiraan_waktu_ditemukan: '20:00 - 21:00 WIB',
          nama_penemu: 'Hendra Gunawan',
          nomor_hp_penemu: '081123456789',
          identitas_penemu: '198608082016011003',
          catatan_penemu:
            'Charger tertinggal di lab komputer setelah praktikum selesai.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Elektronik')?.id,
          pencatat_id: petugas[1].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800',
              nama_file_asli: 'charger_hp.jpg',
              mime_type: 'image/jpeg',
            },
            {
              url_gambar:
                'https://images.unsplash.com/photo-1591290619762-5e4a77f7c5c2?w=800',
              nama_file_asli: 'charger_detail.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Jaket Bomber Hitam',
          deskripsi:
            'Jaket bomber warna hitam ukuran L merek Pull&Bear. Ada patch bordir di lengan kanan.',
          lokasi_umum: 'Gedung B Lantai 2',
          lokasi_spesifik: 'Gantungan baju belakang pintu',
          tanggal_ditemukan: new Date('2024-12-06'),
          perkiraan_waktu_ditemukan: '16:00 - 17:00 WIB',
          nama_penemu: 'Irfan Hakim',
          nomor_hp_penemu: '082234567890',
          identitas_penemu: 'H07890123',
          catatan_penemu: 'Jaket tergantung di belakang pintu kelas.',
          status: StatusBarang.SUDAH_DIAMBIL,
          waktu_diambil: new Date('2024-12-07T14:00:00'),
          nama_pengambil: 'Rudi Hartono',
          identitas_pengambil: 'H07901234',
          kontak_pengambil: '083345678901',
          keterangan_klaim:
            'Pemilik menunjukkan foto diri sedang memakai jaket yang sama. Ada label nama "Rudi" di bagian dalam jaket.',
          kategori_id: categories.find((c) => c.nama === 'Pakaian')?.id,
          pencatat_id: petugas[2].id,
          penyerah_id: petugas[0].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
              nama_file_asli: 'jaket_bomber_depan.jpg',
              mime_type: 'image/jpeg',
            },
            {
              url_gambar:
                'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
              nama_file_asli: 'jaket_bomber_patch.jpg',
              mime_type: 'image/jpeg',
            },
          ],
          foto_bukti_klaim: [
            {
              url_gambar:
                'https://via.placeholder.com/800x600/FF9800/FFFFFF?text=KTM+Rudi+Hartono',
              nama_file_asli: 'ktm_rudi.jpg',
              mime_type: 'image/jpeg',
            },
            {
              url_gambar:
                'https://via.placeholder.com/800x600/FF9800/FFFFFF?text=Label+Nama+Rudi',
              nama_file_asli: 'label_jaket_rudi.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        // Additional items for pagination testing
        {
          nama_barang: 'Tumbler Stainless Steel',
          deskripsi:
            'Tumbler warna hijau merek Tupperware ukuran 500ml. Masih bersih dan tidak penyok.',
          lokasi_umum: 'Meja makan',
          lokasi_spesifik: 'Meja dekat jendela kanan',
          tanggal_ditemukan: new Date('2024-12-08'),
          perkiraan_waktu_ditemukan: '13:00 - 14:00 WIB',
          nama_penemu: 'Lisa Maharani',
          nomor_hp_penemu: '084456789012',
          identitas_penemu: 'H07112233',
          catatan_penemu: 'Tertinggal di meja setelah makan siang.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Lainnya')?.id,
          pencatat_id: petugas[0].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
              nama_file_asli: 'tumbler.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Earphone AirPods Pro',
          deskripsi:
            'AirPods Pro generasi 2 dengan charging case. Kondisi sangat baik, baterai masih penuh.',
          lokasi_umum: 'Gedung A Lantai 1',
          lokasi_spesifik: 'Meja dosen',
          tanggal_ditemukan: new Date('2024-12-09'),
          perkiraan_waktu_ditemukan: '08:00 - 09:00 WIB',
          nama_penemu: 'Kevin Ananda',
          nomor_hp_penemu: '085567890123',
          identitas_penemu: 'H07223344',
          catatan_penemu: 'Ditemukan di meja dosen setelah kelas pagi.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Elektronik')?.id,
          pencatat_id: petugas[1].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
              nama_file_asli: 'airpods.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Payung Lipat Hitam',
          deskripsi: 'Payung lipat warna hitam polos, kondisi baik.',
          lokasi_umum: 'Lantai 1',
          lokasi_spesifik: 'Rak payung dekat pintu masuk',
          tanggal_ditemukan: new Date('2024-12-08'),
          perkiraan_waktu_ditemukan: '15:00 - 16:00 WIB',
          nama_penemu: 'Maya Putri',
          nomor_hp_penemu: '086678901234',
          identitas_penemu: 'H07334455',
          catatan_penemu: 'Tertinggal di rak payung.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Lainnya')?.id,
          pencatat_id: petugas[2].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1527556897832-0c6d8e0c715b?w=800',
              nama_file_asli: 'payung.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Buku Kalkulus Jilid 2',
          deskripsi:
            'Buku kuliah Kalkulus Jilid 2 karangan Purcell. Ada nama pemilik di halaman depan.',
          lokasi_umum: 'Gedung C Lantai 2',
          lokasi_spesifik: 'Laci meja nomor 10',
          tanggal_ditemukan: new Date('2024-12-09'),
          perkiraan_waktu_ditemukan: '17:00 - 18:00 WIB',
          nama_penemu: 'Nanda Saputra',
          nomor_hp_penemu: '087789012345',
          identitas_penemu: 'H07445566',
          catatan_penemu: 'Buku tertinggal di laci meja.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Buku')?.id,
          pencatat_id: petugas[0].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800',
              nama_file_asli: 'buku_kalkulus.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Helm Full Face Merah',
          deskripsi:
            'Helm full face warna merah merek KYT. Ada goresan kecil di bagian belakang.',
          lokasi_umum: 'Blok B',
          lokasi_spesifik: 'Dekat motor Honda Vario putih',
          tanggal_ditemukan: new Date('2024-12-08'),
          perkiraan_waktu_ditemukan: '16:00 - 17:00 WIB',
          nama_penemu: 'Oscar Pratama',
          nomor_hp_penemu: '088890123456',
          identitas_penemu: 'H07556677',
          catatan_penemu: 'Helm tertinggal di jok motor.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Aksesoris')?.id,
          pencatat_id: petugas[1].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
              nama_file_asli: 'helm.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Power Bank Xiaomi 20000mAh',
          deskripsi:
            'Power bank Xiaomi warna putih kapasitas 20000mAh. Kondisi baik, baterai 50%.',
          lokasi_umum: 'Gedung F Lantai 1',
          lokasi_spesifik: 'Meja komputer nomor 5',
          tanggal_ditemukan: new Date('2024-12-09'),
          perkiraan_waktu_ditemukan: '19:00 - 20:00 WIB',
          nama_penemu: 'Putri Andini',
          nomor_hp_penemu: '089901234567',
          identitas_penemu: 'H07667788',
          catatan_penemu: 'Power bank tertinggal di lab setelah praktikum.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Elektronik')?.id,
          pencatat_id: petugas[2].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800',
              nama_file_asli: 'powerbank.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Jaket Jeans Biru',
          deskripsi:
            'Jaket jeans warna biru muda ukuran M. Ada logo bordir di bagian dada kiri.',
          lokasi_umum: 'Lantai 2',
          lokasi_spesifik: 'Kursi nomor 25',
          tanggal_ditemukan: new Date('2024-12-08'),
          perkiraan_waktu_ditemukan: '20:00 - 21:00 WIB',
          nama_penemu: 'Qori Rahmawati',
          nomor_hp_penemu: '081012345678',
          identitas_penemu: 'H07778899',
          catatan_penemu: 'Jaket tertinggal setelah acara musik.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Pakaian')?.id,
          pencatat_id: petugas[0].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
              nama_file_asli: 'jaket_jeans.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Kartu ATM BCA',
          deskripsi:
            'Kartu ATM BCA atas nama Rina Susanti. Ditemukan terpisah dari dompet.',
          lokasi_umum: 'Dekat Kantin Pusat',
          lokasi_spesifik: 'Di lantai dekat mesin ATM BCA',
          tanggal_ditemukan: new Date('2024-12-09'),
          perkiraan_waktu_ditemukan: '14:00 - 15:00 WIB',
          nama_penemu: 'Raka Wijaya',
          nomor_hp_penemu: '082123456789',
          identitas_penemu: 'H07889900',
          catatan_penemu: 'Kartu ATM jatuh di lantai.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Dokumen')?.id,
          pencatat_id: petugas[1].id,
          foto_barang: [
            {
              url_gambar:
                'https://via.placeholder.com/800x600/0073EA/FFFFFF?text=BCA+Card',
              nama_file_asli: 'atm_bca.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Mouse Wireless Logitech',
          deskripsi:
            'Mouse wireless Logitech M185 warna abu-abu. Kondisi baik, masih ada baterai.',
          lokasi_umum: 'Lantai 2',
          lokasi_spesifik: 'Meja baca nomor 20',
          tanggal_ditemukan: new Date('2024-12-08'),
          perkiraan_waktu_ditemukan: '18:00 - 19:00 WIB',
          nama_penemu: 'Sandi Permana',
          nomor_hp_penemu: '083234567890',
          identitas_penemu: 'H07990011',
          catatan_penemu: 'Mouse tertinggal di meja baca.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Elektronik')?.id,
          pencatat_id: petugas[2].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
              nama_file_asli: 'mouse.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Gelang Emas 24 Karat',
          deskripsi:
            'Gelang emas warna kuning 24 karat dengan ukiran nama. Berat sekitar 10 gram.',
          lokasi_umum: 'Area Wudhu Wanita',
          lokasi_spesifik: 'Dekat wastafel nomor 3',
          tanggal_ditemukan: new Date('2024-12-09'),
          perkiraan_waktu_ditemukan: '12:00 - 13:00 WIB',
          nama_penemu: 'Tia Rahmawati',
          nomor_hp_penemu: '084345678901',
          identitas_penemu: 'H07001122',
          catatan_penemu: 'Gelang tertinggal di area wudhu.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Aksesoris')?.id,
          pencatat_id: petugas[0].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
              nama_file_asli: 'gelang_emas.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Sepatu Sneakers Nike Hitam',
          deskripsi:
            'Sepatu Nike Air Force 1 warna hitam ukuran 42. Kondisi masih bagus.',
          lokasi_umum: 'Area Olahraga',
          lokasi_spesifik: 'Pinggir lapangan dekat gawang kanan',
          tanggal_ditemukan: new Date('2024-12-08'),
          perkiraan_waktu_ditemukan: '16:00 - 17:00 WIB',
          nama_penemu: 'Umar Faruq',
          nomor_hp_penemu: '085456789012',
          identitas_penemu: 'H07112244',
          catatan_penemu:
            'Sepatu tertinggal di pinggir lapangan setelah main futsal.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Aksesoris')?.id,
          pencatat_id: petugas[1].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
              nama_file_asli: 'nike_af1.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Tablet Samsung Galaxy Tab S8',
          deskripsi:
            'Samsung Galaxy Tab S8 warna silver dengan keyboard case. Kondisi mulus.',
          lokasi_umum: 'Gedung D Lantai 3',
          lokasi_spesifik: 'Meja paling belakang dekat jendela',
          tanggal_ditemukan: new Date('2024-12-09'),
          perkiraan_waktu_ditemukan: '15:00 - 16:00 WIB',
          nama_penemu: 'Vina Melati',
          nomor_hp_penemu: '086567890123',
          identitas_penemu: 'H07223355',
          catatan_penemu: 'Tablet tertinggal setelah kelas presentasi.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Elektronik')?.id,
          pencatat_id: petugas[2].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
              nama_file_asli: 'tablet_samsung.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Dompet Kulit Hitam Pria',
          deskripsi:
            'Dompet kulit hitam merek Pierre Cardin. Berisi KTP, SIM, dan kartu ATM.',
          lokasi_umum: 'Meja makan',
          lokasi_spesifik: 'Meja nomor 12 dekat kasir',
          tanggal_ditemukan: new Date('2024-12-08'),
          perkiraan_waktu_ditemukan: '13:30 - 14:30 WIB',
          nama_penemu: 'Wahyu Hidayat',
          nomor_hp_penemu: '087678901234',
          identitas_penemu: 'H07334466',
          catatan_penemu: 'Dompet tertinggal di meja setelah makan.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Dompet')?.id,
          pencatat_id: petugas[0].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
              nama_file_asli: 'dompet_pria.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Jam Tangan Casio G-Shock',
          deskripsi:
            'Jam tangan Casio G-Shock warna hitam model GW-B5600. Kondisi sangat baik.',
          lokasi_umum: 'Gedung Olahraga',
          lokasi_spesifik: 'Loker nomor 18',
          tanggal_ditemukan: new Date('2024-12-09'),
          perkiraan_waktu_ditemukan: '17:30 - 18:30 WIB',
          nama_penemu: 'Xena Pratiwi',
          nomor_hp_penemu: '088789012345',
          identitas_penemu: 'H07445577',
          catatan_penemu: 'Jam tertinggal di loker setelah olahraga.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Aksesoris')?.id,
          pencatat_id: petugas[1].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
              nama_file_asli: 'gshock.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Kalung Perak dengan Liontin',
          deskripsi:
            'Kalung perak dengan liontin berbentuk hati. Ada inisial "S" di liontin.',
          lokasi_umum: 'Gedung B Lantai 1',
          lokasi_spesifik: 'Dekat wastafel',
          tanggal_ditemukan: new Date('2024-12-08'),
          perkiraan_waktu_ditemukan: '10:30 - 11:30 WIB',
          nama_penemu: 'Yuni Astuti',
          nomor_hp_penemu: '089890123456',
          identitas_penemu: 'H07556688',
          catatan_penemu: 'Kalung tergeletak di dekat wastafel.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Aksesoris')?.id,
          pencatat_id: petugas[2].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
              nama_file_asli: 'kalung_perak.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Flash Disk SanDisk 64GB',
          deskripsi:
            'Flash disk SanDisk Ultra 64GB warna hitam. Berisi file dokumen penting.',
          lokasi_umum: 'Gedung F Lantai 3',
          lokasi_spesifik: 'Komputer nomor 8',
          tanggal_ditemukan: new Date('2024-12-09'),
          perkiraan_waktu_ditemukan: '20:30 - 21:30 WIB',
          nama_penemu: 'Zaki Rahman',
          nomor_hp_penemu: '081901234567',
          identitas_penemu: 'H07667799',
          catatan_penemu: 'Flash disk tertinggal tertancap di komputer.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Elektronik')?.id,
          pencatat_id: petugas[0].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800',
              nama_file_asli: 'flashdisk.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Sweater Hoodie Abu-abu',
          deskripsi:
            'Sweater hoodie warna abu-abu ukuran XL merek Uniqlo. Kondisi masih bagus.',
          lokasi_umum: 'Gedung E Lantai 2',
          lokasi_spesifik: 'Kursi nomor 15',
          tanggal_ditemukan: new Date('2024-12-08'),
          perkiraan_waktu_ditemukan: '16:30 - 17:30 WIB',
          nama_penemu: 'Aldi Setiawan',
          nomor_hp_penemu: '082012345678',
          identitas_penemu: 'H07778800',
          catatan_penemu: 'Hoodie tertinggal di kursi setelah kelas.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Pakaian')?.id,
          pencatat_id: petugas[1].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
              nama_file_asli: 'hoodie.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Kacamata Minus Bulat',
          deskripsi:
            'Kacamata minus dengan frame bulat warna hitam. Lensa agak tebal (minus tinggi).',
          lokasi_umum: 'Lantai 1',
          lokasi_spesifik: 'Rak buku kategori Komputer',
          tanggal_ditemukan: new Date('2024-12-09'),
          perkiraan_waktu_ditemukan: '14:30 - 15:30 WIB',
          nama_penemu: 'Bella Safitri',
          nomor_hp_penemu: '083123456789',
          identitas_penemu: 'H07889911',
          catatan_penemu: 'Kacamata tertinggal di atas rak buku.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Aksesoris')?.id,
          pencatat_id: petugas[2].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800',
              nama_file_asli: 'kacamata_minus.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Kabel Charger iPhone Lightning',
          deskripsi:
            'Kabel charger iPhone original lightning to USB-C panjang 1 meter.',
          lokasi_umum: 'Lantai 1',
          lokasi_spesifik: 'Sofa dekat resepsionis',
          tanggal_ditemukan: new Date('2024-12-08'),
          perkiraan_waktu_ditemukan: '09:00 - 10:00 WIB',
          nama_penemu: 'Citra Dewi',
          nomor_hp_penemu: '084234567890',
          identitas_penemu: 'H07990022',
          catatan_penemu: 'Kabel tertinggal di sofa ruang tunggu.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Elektronik')?.id,
          pencatat_id: petugas[0].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1591290619762-5e4a77f7c5c2?w=800',
              nama_file_asli: 'kabel_iphone.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
        {
          nama_barang: 'Topi Snapback Hitam',
          deskripsi:
            'Topi snapback warna hitam polos tanpa logo. Kondisi bersih.',
          lokasi_umum: 'Area Olahraga',
          lokasi_spesifik: 'Bangku penonton sebelah kiri',
          tanggal_ditemukan: new Date('2024-12-09'),
          perkiraan_waktu_ditemukan: '18:00 - 19:00 WIB',
          nama_penemu: 'Doni Prasetyo',
          nomor_hp_penemu: '085345678901',
          identitas_penemu: 'H07001133',
          catatan_penemu: 'Topi tertinggal di bangku penonton.',
          status: StatusBarang.BELUM_DIAMBIL,
          kategori_id: categories.find((c) => c.nama === 'Aksesoris')?.id,
          pencatat_id: petugas[1].id,
          foto_barang: [
            {
              url_gambar:
                'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
              nama_file_asli: 'topi.jpg',
              mime_type: 'image/jpeg',
            },
          ],
        },
      ];

      // Filter out items with missing kategori_id and create barang temuan
      let createdCount = 0;
      for (const data of barangTemuanData) {
        // Skip if kategori_id is undefined
        if (!data.kategori_id) {
          this.logger.warn(
            `Skipping ${data.nama_barang} - kategori tidak ditemukan`,
          );
          continue;
        }

        await this.prismaService.barangTemuan.create({
          data: {
            nama_barang: data.nama_barang,
            deskripsi: data.deskripsi,
            lokasi_umum: data.lokasi_umum,
            lokasi_spesifik: data.lokasi_spesifik,
            tanggal_ditemukan: data.tanggal_ditemukan,
            perkiraan_waktu_ditemukan: data.perkiraan_waktu_ditemukan,
            nama_penemu: data.nama_penemu,
            nomor_hp_penemu: data.nomor_hp_penemu,
            identitas_penemu: data.identitas_penemu,
            email_penemu: data.email_penemu,
            catatan_penemu: data.catatan_penemu,
            status: data.status,
            kategori_id: data.kategori_id,
            pencatat_id: data.pencatat_id,
            waktu_diambil: data.waktu_diambil,
            nama_pengambil: data.nama_pengambil,
            identitas_pengambil: data.identitas_pengambil,
            kontak_pengambil: data.kontak_pengambil,
            keterangan_klaim: data.keterangan_klaim,
            penyerah_id: data.penyerah_id,
            // Create foto_barang if exists
            foto_barang: data.foto_barang
              ? {
                  create: data.foto_barang,
                }
              : undefined,
            // Create foto_bukti_klaim if exists
            foto_bukti_klaim: data.foto_bukti_klaim
              ? {
                  create: data.foto_bukti_klaim,
                }
              : undefined,
          },
        });
        createdCount++;
      }

      this.logger.log(
        `✅ Berhasil seeding ${createdCount} dari ${barangTemuanData.length} data barang temuan`,
      );
    } catch (error) {
      this.logger.error('Gagal melakukan seeding data barang temuan');
      throw error;
    }
  }
}
