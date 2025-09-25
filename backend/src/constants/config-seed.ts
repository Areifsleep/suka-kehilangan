export const GENERIC_PASSWORD = '12345678';

export const ROLES_DATA = ['ADMIN', 'USER', 'PETUGAS'];

export const ROLE_NAME_MAPPING = {
  Admin: 'ADMIN',
  User: 'USER',
  Petugas: 'PETUGAS',
};

export const REPORT_CATEGORIES_DATA = [
  {
    name: 'Elektronik',
    description:
      'Barang-barang seperti ponsel, laptop, charger, headphone, dll.',
  },
  {
    name: 'Dokumen & Kartu',
    description: 'Kartu Tanda Mahasiswa (KTM), KTP, SIM, kartu ATM, buku, dll.',
  },
  {
    name: 'Pakaian & Aksesoris',
    description: 'Jaket, topi, syal, kacamata, jam tangan, perhiasan, dll.',
  },
  {
    name: 'Tas & Dompet',
    description: 'Tas ransel, tas selempang, dompet, pouch, dll.',
  },
  {
    name: 'Kunci',
    description: 'Kunci kendaraan, kunci kos/rumah, kunci loker, dll.',
  },
  {
    name: 'Lainnya',
    description:
      'Barang-barang lain yang tidak termasuk dalam kategori di atas.',
  },
];

export const PERMISSIONS_DATA = [
  {
    group: 'Laporan (Reports)',
    permissions: [
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
        name: 'EXPORT-REPORTS',
        description: 'Mengekspor data laporan ke dalam file (cth: Excel, PDF).',
        roles: ['Admin'],
      },
    ],
  },
];
