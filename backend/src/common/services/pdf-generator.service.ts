import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PdfGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

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
      TERSEDIA: 'Tersedia',
      SUDAH_DIAMBIL: 'Sudah Diambil',
    };
    return statusMap[status] || status;
  }

  private truncate(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength - 3) + '...'
      : text;
  }

  // Generate PDF for Barang Temuan (Found Items) History
  async generateBarangTemuanPDF(exportData: {
    items: any[];
    filters: any;
    exportedAt: Date;
    exportedBy: string;
  }): Promise<{ buffer: Buffer; filename: string }> {
    const PDFDocument = (await import('pdfkit')).default;

    const { items, filters } = exportData;

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
      .text('LAPORAN HISTORI BARANG TEMUAN', 50, 180, {
        align: 'center',
      });

    // Info periode/filter
    let filterInfo = 'Periode: ';
    switch (filters.dateRange) {
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

    // Summary statistics
    const totalItems = items.length;
    const tersedia = items.filter((item) => item.status === 'TERSEDIA').length;
    const sudahDiambil = items.filter(
      (item) => item.status === 'SUDAH_DIAMBIL',
    ).length;

    doc.fontSize(10).font('Helvetica-Bold').text('Ringkasan:', 50, 240);
    doc
      .fontSize(9)
      .font('Helvetica')
      .text(`Total Barang: ${totalItems}`, 50, 255);
    doc.text(`Tersedia: ${tersedia}`, 50, 268);
    doc.text(`Sudah Diambil: ${sudahDiambil}`, 50, 281);

    // Tabel header
    const startY = 310;
    let currentY = startY;

    // Table header background
    doc
      .rect(50, currentY, 495, 20)
      .fillAndStroke('#0066cc', '#000000')
      .lineWidth(0.5);

    // Table headers
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
    doc.text('No', 55, currentY + 5, { width: 25, align: 'left' });
    doc.text('Nama Barang', 85, currentY + 5, { width: 120, align: 'left' });
    doc.text('Kategori', 210, currentY + 5, { width: 70, align: 'left' });
    doc.text('Lokasi', 285, currentY + 5, { width: 80, align: 'left' });
    doc.text('Status', 370, currentY + 5, { width: 60, align: 'left' });
    doc.text('Tanggal', 435, currentY + 5, { width: 105, align: 'left' });

    currentY += 20;

    // Reset fill color for content
    doc.fillColor('#000000');

    // Table content
    items.forEach((item, index) => {
      // Check if we need a new page
      if (currentY > 720) {
        doc.addPage();
        currentY = 50;

        // Redraw header on new page
        doc
          .rect(50, currentY, 495, 20)
          .fillAndStroke('#0066cc', '#000000')
          .lineWidth(0.5);
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
        doc.text('No', 55, currentY + 5, { width: 25, align: 'left' });
        doc.text('Nama Barang', 85, currentY + 5, {
          width: 120,
          align: 'left',
        });
        doc.text('Kategori', 210, currentY + 5, { width: 70, align: 'left' });
        doc.text('Lokasi', 285, currentY + 5, { width: 80, align: 'left' });
        doc.text('Status', 370, currentY + 5, { width: 60, align: 'left' });
        doc.text('Tanggal', 435, currentY + 5, { width: 105, align: 'left' });
        currentY += 20;
        doc.fillColor('#000000');
      }

      // Alternating row colors
      if (index % 2 === 0) {
        doc.rect(50, currentY, 495, 20).fill('#f5f5f5');
      }

      doc.fontSize(8).font('Helvetica');
      doc.fillColor('#000000');

      doc.text(`${index + 1}`, 55, currentY + 5, { width: 25, align: 'left' });
      doc.text(this.truncate(item.nama_barang, 25), 85, currentY + 5, {
        width: 120,
        align: 'left',
      });
      doc.text(this.truncate(item.kategori.nama, 15), 210, currentY + 5, {
        width: 70,
        align: 'left',
      });
      doc.text(this.truncate(item.lokasi_ditemukan, 18), 285, currentY + 5, {
        width: 80,
        align: 'left',
      });
      doc.text(this.translateStatus(item.status), 370, currentY + 5, {
        width: 60,
        align: 'left',
      });
      doc.text(this.formatDate(item.created_at), 435, currentY + 5, {
        width: 105,
        align: 'left',
      });

      // Row border
      doc
        .moveTo(50, currentY)
        .lineTo(545, currentY)
        .lineWidth(0.5)
        .stroke('#cccccc');

      currentY += 20;
    });

    // Bottom border of table
    doc
      .moveTo(50, currentY)
      .lineTo(545, currentY)
      .lineWidth(0.5)
      .stroke('#000000');

    // Footer dengan tanda tangan
    const footerY = currentY + 40;

    // Check if footer fits on current page, otherwise add new page
    if (footerY > 700) {
      doc.addPage();
      currentY = 50;
    }

    doc
      .fontSize(9)
      .font('Helvetica')
      .text(
        `Yogyakarta, ${this.formatDate(new Date())}`,
        350,
        footerY > 700 ? 80 : footerY,
        {
          align: 'left',
        },
      );

    doc.text('Administrator', 350, footerY > 700 ? 95 : footerY + 15, {
      align: 'left',
    });

    doc.text('___________________', 350, footerY > 700 ? 155 : footerY + 75, {
      align: 'left',
    });

    // Finalize PDF
    doc.end();

    // Wait for PDF to finish
    const buffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    });

    // Generate filename
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .split('T')[0];
    const filename = `Laporan_Barang_Temuan_${timestamp}.pdf`;

    return { buffer, filename };
  }
}
