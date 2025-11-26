import { Injectable } from '@nestjs/common';
import { ExportAuditReportsDto } from '../../management/dto/audit.dto';
import { PrismaService } from '../../prisma/prisma.service';

interface ReportData {
  id: string;
  item_name: string;
  description: string | null;
  place_found: string;
  report_type: string;
  report_status: string;
  created_at: Date;
  updated_at: Date;
  claimed_at: Date | null;
  category: {
    id: string;
    name: string;
  };
  created_by: {
    id: string;
    profile: {
      full_name: string;
    } | null;
    role: {
      name: string;
    };
  };
  claimed_by: {
    id: string;
    profile: {
      full_name: string;
    } | null;
  } | null;
}

@Injectable()
export class PdfGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  async generateAuditReportPDF(
    queryDto: ExportAuditReportsDto,
  ): Promise<{ buffer: Buffer; filename: string }> {
    const PDFDocument = (await import('pdfkit')).default;

    const {
      search,
      status,
      categoryId,
      dateRange = 'all',
      reportType,
    } = queryDto;

    // Build where conditions (sama seperti di getAuditReports)
    const where: any = {};

    if (search) {
      where.OR = [
        { item_name: { contains: search } },
        { description: { contains: search } },
        { place_found: { contains: search } },
        {
          created_by: {
            profile: {
              full_name: { contains: search },
            },
          },
        },
      ];
    }

    if (status) {
      where.report_status = status;
    }

    if (categoryId) {
      where.report_category_id = categoryId;
    }

    if (reportType) {
      where.report_type = reportType;
    }

    // Date range filtering
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      where.created_at = {
        gte: startDate,
      };
    }

    // Fetch all reports (no pagination for export)
    const reports: ReportData[] = await this.prisma.report.findMany({
      where,
      select: {
        id: true,
        item_name: true,
        description: true,
        place_found: true,
        report_type: true,
        report_status: true,
        created_at: true,
        updated_at: true,
        claimed_at: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        created_by: {
          select: {
            id: true,
            profile: {
              select: {
                full_name: true,
              },
            },
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        claimed_by: {
          select: {
            id: true,
            profile: {
              select: {
                full_name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Create PDF
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true,
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));

    // Header dengan logo dan informasi universitas
    await this.addHeader(doc);

    // Judul laporan
    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('LAPORAN AUDIT BARANG HILANG DAN DITEMUKAN', 50, 180, {
        align: 'center',
      });

    // Info periode/filter
    let filterInfo = 'Periode: ';
    switch (dateRange) {
      case 'today':
        filterInfo += 'Hari Ini';
        break;
      case 'week':
        filterInfo += 'Minggu Ini';
        break;
      case 'month':
        filterInfo += 'Bulan Ini';
        break;
      default:
        filterInfo += 'Semua Waktu';
    }

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(filterInfo, 50, 200, { align: 'center' });

    doc
      .fontSize(10)
      .text(`Tanggal Cetak: ${this.formatDate(new Date())}`, 50, 215, {
        align: 'center',
      });

    // Tabel data
    let yPosition = 250;

    // Header tabel
    doc.fontSize(9).font('Helvetica-Bold');

    const colWidths = {
      no: 30,
      tanggal: 70,
      nama: 100,
      kategori: 80,
      status: 60,
      pelapor: 90,
      lokasi: 95,
    };

    const startX = 50;

    // Draw header background
    doc
      .rect(startX, yPosition - 5, 495, 20)
      .fillAndStroke('#E5E7EB', '#9CA3AF');

    doc.fillColor('#000000');
    doc.text('No', startX + 5, yPosition, {
      width: colWidths.no,
      align: 'center',
    });
    doc.text('Tanggal', startX + colWidths.no + 5, yPosition, {
      width: colWidths.tanggal,
      align: 'left',
    });
    doc.text(
      'Nama Barang',
      startX + colWidths.no + colWidths.tanggal + 10,
      yPosition,
      { width: colWidths.nama, align: 'left' },
    );
    doc.text(
      'Kategori',
      startX + colWidths.no + colWidths.tanggal + colWidths.nama + 15,
      yPosition,
      { width: colWidths.kategori, align: 'left' },
    );
    doc.text(
      'Status',
      startX +
        colWidths.no +
        colWidths.tanggal +
        colWidths.nama +
        colWidths.kategori +
        20,
      yPosition,
      { width: colWidths.status, align: 'left' },
    );
    doc.text(
      'Pelapor',
      startX +
        colWidths.no +
        colWidths.tanggal +
        colWidths.nama +
        colWidths.kategori +
        colWidths.status +
        25,
      yPosition,
      { width: colWidths.pelapor, align: 'left' },
    );
    doc.text(
      'Lokasi',
      startX +
        colWidths.no +
        colWidths.tanggal +
        colWidths.nama +
        colWidths.kategori +
        colWidths.status +
        colWidths.pelapor +
        30,
      yPosition,
      { width: colWidths.lokasi, align: 'left' },
    );

    yPosition += 20;
    doc.font('Helvetica').fontSize(8);

    // Data rows
    reports.forEach((report, index) => {
      // Check if need new page
      if (yPosition > 720) {
        doc.addPage();
        yPosition = 50;

        // Repeat header on new page
        doc.fontSize(9).font('Helvetica-Bold');
        doc
          .rect(startX, yPosition - 5, 495, 20)
          .fillAndStroke('#E5E7EB', '#9CA3AF');

        doc.fillColor('#000000');
        doc.text('No', startX + 5, yPosition, {
          width: colWidths.no,
          align: 'center',
        });
        doc.text('Tanggal', startX + colWidths.no + 5, yPosition, {
          width: colWidths.tanggal,
          align: 'left',
        });
        doc.text(
          'Nama Barang',
          startX + colWidths.no + colWidths.tanggal + 10,
          yPosition,
          { width: colWidths.nama, align: 'left' },
        );
        doc.text(
          'Kategori',
          startX + colWidths.no + colWidths.tanggal + colWidths.nama + 15,
          yPosition,
          { width: colWidths.kategori, align: 'left' },
        );
        doc.text(
          'Status',
          startX +
            colWidths.no +
            colWidths.tanggal +
            colWidths.nama +
            colWidths.kategori +
            20,
          yPosition,
          { width: colWidths.status, align: 'left' },
        );
        doc.text(
          'Pelapor',
          startX +
            colWidths.no +
            colWidths.tanggal +
            colWidths.nama +
            colWidths.kategori +
            colWidths.status +
            25,
          yPosition,
          { width: colWidths.pelapor, align: 'left' },
        );
        doc.text(
          'Lokasi',
          startX +
            colWidths.no +
            colWidths.tanggal +
            colWidths.nama +
            colWidths.kategori +
            colWidths.status +
            colWidths.pelapor +
            30,
          yPosition,
          { width: colWidths.lokasi, align: 'left' },
        );

        yPosition += 20;
        doc.font('Helvetica').fontSize(8);
      }

      // Zebra striping
      if (index % 2 === 0) {
        doc.rect(startX, yPosition - 3, 495, 18).fill('#F9FAFB');
      }

      doc.fillColor('#000000');

      const rowY = yPosition;
      doc.text((index + 1).toString(), startX + 5, rowY, {
        width: colWidths.no,
        align: 'center',
      });
      doc.text(
        this.formatDate(report.created_at),
        startX + colWidths.no + 5,
        rowY,
        { width: colWidths.tanggal },
      );
      doc.text(
        this.truncate(report.item_name, 25),
        startX + colWidths.no + colWidths.tanggal + 10,
        rowY,
        { width: colWidths.nama },
      );
      doc.text(
        this.truncate(report.category.name, 20),
        startX + colWidths.no + colWidths.tanggal + colWidths.nama + 15,
        rowY,
        { width: colWidths.kategori },
      );
      doc.text(
        this.translateStatus(report.report_status),
        startX +
          colWidths.no +
          colWidths.tanggal +
          colWidths.nama +
          colWidths.kategori +
          20,
        rowY,
        { width: colWidths.status },
      );
      doc.text(
        this.truncate(report.created_by.profile?.full_name || 'Unknown', 22),
        startX +
          colWidths.no +
          colWidths.tanggal +
          colWidths.nama +
          colWidths.kategori +
          colWidths.status +
          25,
        rowY,
        { width: colWidths.pelapor },
      );
      doc.text(
        this.truncate(report.place_found, 22),
        startX +
          colWidths.no +
          colWidths.tanggal +
          colWidths.nama +
          colWidths.kategori +
          colWidths.status +
          colWidths.pelapor +
          30,
        rowY,
        { width: colWidths.lokasi },
      );

      yPosition += 18;
    });

    // Summary
    yPosition += 20;
    if (yPosition > 700) {
      doc.addPage();
      yPosition = 50;
    }

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Ringkasan:', 50, yPosition);
    yPosition += 15;

    doc.fontSize(9).font('Helvetica');
    doc.text(`Total Laporan: ${reports.length}`, 50, yPosition);
    yPosition += 12;

    const foundCount = reports.filter((r) => r.report_type === 'FOUND').length;
    const lostCount = reports.filter((r) => r.report_type === 'LOST').length;
    const openCount = reports.filter((r) => r.report_status === 'OPEN').length;
    const claimedCount = reports.filter(
      (r) => r.report_status === 'CLAIMED',
    ).length;
    const closedCount = reports.filter(
      (r) => r.report_status === 'CLOSED',
    ).length;

    doc.text(`Barang Ditemukan: ${foundCount}`, 50, yPosition);
    yPosition += 12;
    doc.text(`Barang Hilang: ${lostCount}`, 50, yPosition);
    yPosition += 12;
    doc.text(`Status Terbuka: ${openCount}`, 50, yPosition);
    yPosition += 12;
    doc.text(`Status Diklaim: ${claimedCount}`, 50, yPosition);
    yPosition += 12;
    doc.text(`Status Selesai: ${closedCount}`, 50, yPosition);

    // Footer with page numbers
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);

      // Footer line
      doc.moveTo(50, 780).lineTo(545, 780).stroke('#9CA3AF');

      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#6B7280')
        .text(`Halaman ${i + 1} dari ${pages.count}`, 50, 785, {
          align: 'center',
        });

      doc
        .fontSize(7)
        .text(
          'Dokumen ini dihasilkan secara otomatis oleh Sistem Informasi Barang Hilang UIN Sunan Kalijaga',
          50,
          795,
          { align: 'center' },
        );
    }

    doc.end();

    return new Promise((resolve, reject) => {
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const filename = `laporan-audit-${Date.now()}.pdf`;
        resolve({ buffer, filename });
      });

      doc.on('error', reject);
    });
  }

  private async addHeader(doc: any) {
    // Download logo UIN
    const logoUrl =
      'https://lpm.uin-suka.ac.id/media/dokumen_akademik/011_20211205_UIN%20Sunan%20Kalijaga.png';

    let logoBuffer: Buffer | null = null;
    try {
      const response = await fetch(logoUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        logoBuffer = Buffer.from(arrayBuffer);
      }
    } catch (error) {
      console.error('Failed to load logo:', error);
      // Continue without logo if failed
    }

    // Add logo on the left if successfully loaded
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, 50, 50, {
          width: 60,
          height: 75,
        });
      } catch (error) {
        console.error('Failed to add logo to PDF:', error);
      }
    }

    // Header dengan informasi universitas (shifted right to accommodate logo)
    const textStartX = logoBuffer ? 120 : 50;

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('KEMENTERIAN AGAMA REPUBLIK INDONESIA', textStartX, 50, {
        align: 'center',
        width: 425,
      });

    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .text('UNIVERSITAS ISLAM NEGERI', textStartX, 67, {
        align: 'center',
        width: 425,
      });

    doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('SUNAN KALIJAGA', textStartX, 82, {
        align: 'center',
        width: 425,
      });

    // Alamat dan kontak
    doc.fontSize(8).font('Helvetica');
    doc.text(
      'Jl. Marsda Adisucipto - Telp. (0274) 512474, 589621, Fax (0274) 586117',
      textStartX,
      105,
      {
        align: 'center',
        width: 425,
      },
    );

    doc.text('http://www.uin-suka.ac.id  Yogyakarta 55281', textStartX, 115, {
      align: 'center',
      width: 425,
    });

    // Line separator
    doc.moveTo(50, 135).lineTo(545, 135).lineWidth(2).stroke('#000000');

    doc.moveTo(50, 138).lineTo(545, 138).lineWidth(0.5).stroke('#000000');
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  private translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
      OPEN: 'Terbuka',
      CLAIMED: 'Diklaim',
      CLOSED: 'Selesai',
    };
    return statusMap[status] || status;
  }

  private truncate(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength - 3) + '...'
      : text;
  }
}
