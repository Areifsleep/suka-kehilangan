import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Dashboard untuk    const lokasiDistribusi = awai    // 2. Trend bulanan (6       trendBulanan.push({
        bulan: monthStart.toLocaleDateString('id-ID', { month: 'short' }),
        ditemukan,
        diambil,
      });
    }

    type TrendItem = {ir)
    const trendBulanan: TrendItem[] = [];
    for (let i = 5; i >= 0; i--) {his.prismaService.barangTemuan.groupBy({
      by: ['lokasi_umum'],
      where: {
        pencatat_id: userId,
        lokasi_umum: { not: null as any },
      },
      _count: {
        lokasi_umum: true,
      },
      orderBy: {
        _count: {
          lokasi_umum: 'desc',
        },
      },
      take: 5,
    });mpilkan statistik barang yang bisa diklaim
   */
  async getUserDashboard() {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total barang tersedia (BELUM_DIAMBIL)
    const totalTersedia = await this.prismaService.barangTemuan.count({
      where: { status: 'BELUM_DIAMBIL' },
    });

    // Barang baru hari ini
    const barangHariIni = await this.prismaService.barangTemuan.count({
      where: {
        status: 'BELUM_DIAMBIL',
        created_at: { gte: startOfDay },
      },
    });

    // Barang baru minggu ini
    const barangMingguIni = await this.prismaService.barangTemuan.count({
      where: {
        status: 'BELUM_DIAMBIL',
        created_at: { gte: startOfWeek },
      },
    });

    // Barang baru bulan ini
    const barangBulanIni = await this.prismaService.barangTemuan.count({
      where: {
        status: 'BELUM_DIAMBIL',
        created_at: { gte: startOfMonth },
      },
    });

    // Kategori terpopuler (barang BELUM_DIAMBIL)
    const kategoriPopuler = await this.prismaService.kategoriBarang.findMany({
      select: {
        id: true,
        nama: true,
        _count: {
          select: {
            daftar_barang: {
              where: { status: 'BELUM_DIAMBIL' },
            },
          },
        },
      },
      orderBy: {
        daftar_barang: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    // Barang terbaru (limit 10)
    const barangTerbaru = await this.prismaService.barangTemuan.findMany({
      where: { status: 'BELUM_DIAMBIL' },
      select: {
        id: true,
        nama_barang: true,
        kategori: {
          select: { nama: true },
        },
        lokasi_umum: true,
        lokasi_spesifik: true,
        tanggal_ditemukan: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    return {
      statistik: {
        total_tersedia: totalTersedia,
        barang_hari_ini: barangHariIni,
        barang_minggu_ini: barangMingguIni,
        barang_bulan_ini: barangBulanIni,
      },
      kategori_populer: kategoriPopuler.map((k) => ({
        id: k.id,
        nama: k.nama,
        jumlah: k._count.daftar_barang,
      })),
      barang_terbaru: barangTerbaru,
    };
  }

  /**
   * Dashboard untuk PETUGAS
   * Menampilkan statistik barang yang dicatat petugas ini
   */
  async getPetugasDashboard(userId: string) {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total barang yang dicatat petugas ini
    const totalDicatat = await this.prismaService.barangTemuan.count({
      where: { pencatat_id: userId },
    });

    // Barang yang belum diambil
    const belumDiambil = await this.prismaService.barangTemuan.count({
      where: {
        pencatat_id: userId,
        status: 'BELUM_DIAMBIL',
      },
    });

    // Barang yang sudah diambil
    const sudahDiambil = await this.prismaService.barangTemuan.count({
      where: {
        pencatat_id: userId,
        status: 'SUDAH_DIAMBIL',
      },
    });

    // Barang dicatat hari ini
    const barangHariIni = await this.prismaService.barangTemuan.count({
      where: {
        pencatat_id: userId,
        created_at: { gte: startOfDay },
      },
    });

    // Barang dicatat minggu ini
    const barangMingguIni = await this.prismaService.barangTemuan.count({
      where: {
        pencatat_id: userId,
        created_at: { gte: startOfWeek },
      },
    });

    // Barang dicatat bulan ini
    const barangBulanIni = await this.prismaService.barangTemuan.count({
      where: {
        pencatat_id: userId,
        created_at: { gte: startOfMonth },
      },
    });

    // Barang diserahkan hari ini (sebagai penyerah)
    const diserahkanHariIni = await this.prismaService.barangTemuan.count({
      where: {
        penyerah_id: userId,
        waktu_diambil: { gte: startOfDay },
      },
    });

    // Barang diserahkan minggu ini
    const diserahkanMingguIni = await this.prismaService.barangTemuan.count({
      where: {
        penyerah_id: userId,
        waktu_diambil: { gte: startOfWeek },
      },
    });

    // Barang diserahkan bulan ini
    const diserahkanBulanIni = await this.prismaService.barangTemuan.count({
      where: {
        penyerah_id: userId,
        waktu_diambil: { gte: startOfMonth },
      },
    });

    // Aktivitas terbaru (barang yang dicatat atau diserahkan)
    const aktivitasTerbaru = await this.prismaService.barangTemuan.findMany({
      where: {
        OR: [{ pencatat_id: userId }, { penyerah_id: userId }],
      },
      select: {
        id: true,
        nama_barang: true,
        status: true,
        kategori: { select: { nama: true } },
        created_at: true,
        waktu_diambil: true,
        pencatat_id: true,
      },
      orderBy: { updated_at: 'desc' },
      take: 10,
    });

    // Data untuk charts
    // 1. Distribusi per kategori (barang yang dicatat petugas ini)
    const kategoriRaw = await this.prismaService.barangTemuan.groupBy({
      by: ['kategori_id'],
      where: {
        pencatat_id: userId,
      },
      _count: {
        kategori_id: true,
      },
      orderBy: {
        _count: {
          kategori_id: 'desc',
        },
      },
      take: 6,
    });

    // Get kategori names
    const kategoriIds = kategoriRaw.map((k) => k.kategori_id);
    const kategoriList = await this.prismaService.kategoriBarang.findMany({
      where: {
        id: { in: kategoriIds },
      },
      select: {
        id: true,
        nama: true,
      },
    });

    const kategoriMap = new Map(kategoriList.map((k) => [k.id, k.nama]));
    const kategoriDistribusi = kategoriRaw.map((k) => ({
      id: k.kategori_id,
      nama: kategoriMap.get(k.kategori_id!) || 'Unknown',
      jumlah: (k._count as any).kategori_id,
    }));

    // 2. Distribusi per lokasi (barang yang dicatat petugas ini)
    const lokasiDistribusi = await this.prismaService.barangTemuan.groupBy({
      by: ['lokasi_umum'],
      where: {
        pencatat_id: userId,
      },
      _count: {
        lokasi_umum: true,
      },
      orderBy: {
        _count: {
          lokasi_umum: 'desc',
        },
      },
      take: 7,
    });

    // 3. Trend bulanan (6 bulan terakhir)
    type TrendItem = {
      bulan: string;
      ditemukan: number;
      diambil: number;
    };
    const trendBulanan: TrendItem[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const ditemukan = await this.prismaService.barangTemuan.count({
        where: {
          pencatat_id: userId,
          created_at: { gte: monthStart, lte: monthEnd },
        },
      });

      const diambil = await this.prismaService.barangTemuan.count({
        where: {
          pencatat_id: userId,
          status: 'SUDAH_DIAMBIL',
          waktu_diambil: { gte: monthStart, lte: monthEnd },
        },
      });

      trendBulanan.push({
        bulan: monthStart.toLocaleDateString('id-ID', { month: 'short' }),
        ditemukan,
        diambil,
      });
    }

    return {
      statistik: {
        total_dicatat: totalDicatat,
        belum_diambil: belumDiambil,
        sudah_diambil: sudahDiambil,
      },
      pencatatan: {
        hari_ini: barangHariIni,
        minggu_ini: barangMingguIni,
        bulan_ini: barangBulanIni,
      },
      penyerahan: {
        hari_ini: diserahkanHariIni,
        minggu_ini: diserahkanMingguIni,
        bulan_ini: diserahkanBulanIni,
      },
      aktivitas_terbaru: aktivitasTerbaru.map((item) => ({
        id: item.id,
        nama_barang: item.nama_barang,
        kategori: item.kategori.nama,
        status: item.status,
        aksi:
          item.pencatat_id === userId && !item.waktu_diambil
            ? 'Dicatat'
            : 'Diserahkan',
        waktu: item.waktu_diambil || item.created_at,
      })),
      charts: {
        kategori: kategoriDistribusi.map((k) => ({
          label: k.nama,
          value: k.jumlah,
        })),
        lokasi: lokasiDistribusi.map((l) => ({
          name: l.lokasi_umum,
          count: (l._count as any).lokasi_umum,
        })),
        trend: trendBulanan,
      },
    };
  }

  /**
   * Dashboard untuk ADMIN
   * Menampilkan statistik keseluruhan sistem
   */
  async getAdminDashboard() {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total barang
    const totalBarang = await this.prismaService.barangTemuan.count();

    // Barang belum diambil
    const belumDiambil = await this.prismaService.barangTemuan.count({
      where: { status: 'BELUM_DIAMBIL' },
    });

    // Barang sudah diambil
    const sudahDiambil = await this.prismaService.barangTemuan.count({
      where: { status: 'SUDAH_DIAMBIL' },
    });

    // Barang baru hari ini
    const barangHariIni = await this.prismaService.barangTemuan.count({
      where: { created_at: { gte: startOfDay } },
    });

    // Barang baru minggu ini
    const barangMingguIni = await this.prismaService.barangTemuan.count({
      where: { created_at: { gte: startOfWeek } },
    });

    // Barang baru bulan ini
    const barangBulanIni = await this.prismaService.barangTemuan.count({
      where: { created_at: { gte: startOfMonth } },
    });

    // Barang diambil hari ini
    const diambilHariIni = await this.prismaService.barangTemuan.count({
      where: {
        status: 'SUDAH_DIAMBIL',
        waktu_diambil: { gte: startOfDay },
      },
    });

    // Barang diambil minggu ini
    const diambilMingguIni = await this.prismaService.barangTemuan.count({
      where: {
        status: 'SUDAH_DIAMBIL',
        waktu_diambil: { gte: startOfWeek },
      },
    });

    // Barang diambil bulan ini
    const diambilBulanIni = await this.prismaService.barangTemuan.count({
      where: {
        status: 'SUDAH_DIAMBIL',
        waktu_diambil: { gte: startOfMonth },
      },
    });

    // Total users by role
    const usersByRole = await this.prismaService.role.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { users: true },
        },
      },
    });

    // Total kategori
    const totalKategori = await this.prismaService.kategoriBarang.count();

    // Kategori terpopuler
    const kategoriPopuler = await this.prismaService.kategoriBarang.findMany({
      select: {
        id: true,
        nama: true,
        _count: {
          select: { daftar_barang: true },
        },
      },
      orderBy: {
        daftar_barang: { _count: 'desc' },
      },
      take: 5,
    });

    // Petugas teraktif (paling banyak mencatat barang)
    const petugasTeraktif = await this.prismaService.user.findMany({
      where: {
        role: { name: 'PETUGAS' },
      },
      select: {
        id: true,
        profile: {
          select: {
            full_name: true,
            lokasi_pos: true,
          },
        },
        _count: {
          select: {
            barang_dicatat: true,
            barang_diserahkan: true,
          },
        },
      },
      orderBy: {
        barang_dicatat: { _count: 'desc' },
      },
      take: 5,
    });

    // Persentase klaim
    const persentaseKlaim =
      totalBarang > 0 ? ((sudahDiambil / totalBarang) * 100).toFixed(2) : 0;

    // Aktivitas terbaru (semua barang yang baru dicatat atau diserahkan)
    const aktivitasTerbaru = await this.prismaService.barangTemuan.findMany({
      select: {
        id: true,
        nama_barang: true,
        status: true,
        kategori: { select: { nama: true } },
        created_at: true,
        waktu_diambil: true,
      },
      orderBy: { updated_at: 'desc' },
      take: 10,
    });

    // Data untuk charts
    // 1. Distribusi per kategori (semua barang)
    const kategoriRaw = await this.prismaService.barangTemuan.groupBy({
      by: ['kategori_id'],
      _count: {
        kategori_id: true,
      },
      orderBy: {
        _count: {
          kategori_id: 'desc',
        },
      },
      take: 6,
    });

    // Get kategori names
    const kategoriIds = kategoriRaw.map((k) => k.kategori_id);
    const kategoriList = await this.prismaService.kategoriBarang.findMany({
      where: {
        id: { in: kategoriIds },
      },
      select: {
        id: true,
        nama: true,
      },
    });

    const kategoriMap = new Map(kategoriList.map((k) => [k.id, k.nama]));
    const kategoriDistribusi = kategoriRaw.map((k) => ({
      id: k.kategori_id,
      nama: kategoriMap.get(k.kategori_id!) || 'Unknown',
      jumlah: (k._count as any).kategori_id,
    }));

    // 2. Trend bulanan (6 bulan terakhir)
    type AdminTrendItem = {
      bulan: string;
      ditemukan: number;
      diambil: number;
    };
    const trendBulanan: AdminTrendItem[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const ditemukan = await this.prismaService.barangTemuan.count({
        where: {
          created_at: { gte: monthStart, lte: monthEnd },
        },
      });

      const diambil = await this.prismaService.barangTemuan.count({
        where: {
          status: 'SUDAH_DIAMBIL',
          waktu_diambil: { gte: monthStart, lte: monthEnd },
        },
      });

      trendBulanan.push({
        bulan: monthStart.toLocaleDateString('id-ID', { month: 'short' }),
        ditemukan,
        diambil,
      });
    }

    return {
      statistik: {
        total_barang: totalBarang,
        belum_diambil: belumDiambil,
        sudah_diambil: sudahDiambil,
        persentase_klaim: persentaseKlaim,
      },
      pencatatan: {
        hari_ini: barangHariIni,
        minggu_ini: barangMingguIni,
        bulan_ini: barangBulanIni,
      },
      pengambilan: {
        hari_ini: diambilHariIni,
        minggu_ini: diambilMingguIni,
        bulan_ini: diambilBulanIni,
      },
      users: {
        total_kategori: totalKategori,
        by_role: usersByRole.map((role) => ({
          role: role.name,
          count: role._count.users,
        })),
      },
      kategori_populer: kategoriPopuler.map((k) => ({
        id: k.id,
        nama: k.nama,
        jumlah: k._count.daftar_barang,
      })),
      petugas_teraktif: petugasTeraktif.map((p) => ({
        id: p.id,
        nama: p.profile?.full_name || 'Unknown',
        lokasi_pos: p.profile?.lokasi_pos || null,
        total_dicatat: p._count.barang_dicatat,
        total_diserahkan: p._count.barang_diserahkan,
      })),
      aktivitas_terbaru: aktivitasTerbaru.map((item) => ({
        id: item.id,
        nama_barang: item.nama_barang,
        kategori: item.kategori.nama,
        status: item.status,
        aksi: item.waktu_diambil ? 'Diserahkan' : 'Dicatat',
        waktu: item.waktu_diambil || item.created_at,
      })),
      charts: {
        kategori: kategoriDistribusi.map((k) => ({
          label: k.nama,
          value: k.jumlah,
        })),
        trend: trendBulanan,
      },
    };
  }
}
