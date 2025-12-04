import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto, GetReportsQueryDto } from './dto/reports.dto';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories() {
    const categories = await this.prisma.reportCategory.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      success: true,
      data: categories,
    };
  }

  async createReport(
    createReportDto: CreateReportDto,
    images: Express.Multer.File[],
    userId: string,
  ) {
    try {
      // Validate category exists
      const category = await this.prisma.reportCategory.findUnique({
        where: { id: createReportDto.report_category_id },
      });

      if (!category) {
        throw new BadRequestException('Kategori tidak ditemukan');
      }

      // Create report in transaction
      const result = await this.prisma.$transaction(async (prisma) => {
        // Create the report
        const report = await prisma.report.create({
          data: {
            item_name: createReportDto.item_name,
            report_category_id: createReportDto.report_category_id,
            description: createReportDto.description,
            place_found: createReportDto.place_found,
            specific_location: createReportDto.specific_location,
            lost_date: createReportDto.lost_date
              ? new Date(createReportDto.lost_date)
              : null,
            lost_time: createReportDto.lost_time,
            additional_notes: createReportDto.additional_notes,
            report_type: createReportDto.report_type,
            // report_status akan menggunakan default dari schema
            created_by_user_id: userId,
          },
          include: {
            category: true,
            created_by: {
              include: {
                profile: true,
                role: true,
              },
            },
          },
        });

        // Handle image uploads if any
        if (images && images.length > 0) {
          const uploadDir = path.join(
            process.cwd(),
            'public',
            'uploads',
            'reports',
          );

          // Ensure upload directory exists
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const imagePromises = images.map(async (image, index) => {
            const fileExtension = path.extname(image.originalname);
            const storageKey = `${report.id}_${uuidv4()}${fileExtension}`;
            const filePath = path.join(uploadDir, storageKey);

            // Save file to disk
            fs.writeFileSync(filePath, image.buffer);

            // Save image record to database
            return prisma.reportImage.create({
              data: {
                report_id: report.id,
                storage_key: storageKey,
                original_filename: image.originalname,
                file_size: image.size,
                mime_type: image.mimetype,
                is_primary: index === 0, // First image is primary
              },
            });
          });

          await Promise.all(imagePromises);
        }

        return report;
      });

      return {
        success: true,
        message: 'Laporan berhasil dibuat',
        data: result,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error('Error creating report:', error);
      throw new BadRequestException('Gagal membuat laporan');
    }
  }

  async getUserReports(userId: string, queryDto: GetReportsQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      category_id,
      search,
    } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {
      created_by_user_id: userId,
    };

    if (status) {
      where.report_status = status;
    }

    if (type) {
      where.report_type = type;
    }

    if (category_id) {
      where.report_category_id = category_id;
    }

    if (search) {
      where.OR = [
        { item_name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { place_found: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          category: true,
          report_images: true,
          created_by: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      success: true,
      data: {
        reports,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit,
        },
      },
    };
  }

  async getReportById(reportId: string, userId: string, userRole: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        category: true,
        report_images: true,
        created_by: {
          include: {
            profile: true,
            role: true,
          },
        },
        claimed_by: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Laporan tidak ditemukan');
    }

    // Check access permissions
    const canAccess =
      report.created_by_user_id === userId || // Owner
      userRole === 'ADMIN' || // Admin can see all
      userRole === 'PETUGAS'; // Petugas can see all

    if (!canAccess) {
      throw new ForbiddenException(
        'Anda tidak memiliki akses untuk melihat laporan ini',
      );
    }

    return {
      success: true,
      data: report,
    };
  }

  async getAllReports(queryDto: GetReportsQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      category_id,
      search,
    } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.report_status = status;
    }

    if (type) {
      where.report_type = type;
    }

    if (category_id) {
      where.report_category_id = category_id;
    }

    if (search) {
      where.OR = [
        { item_name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { place_found: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          category: true,
          report_images: true,
          created_by: {
            include: {
              profile: true,
              role: true,
            },
          },
          claimed_by: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      success: true,
      data: {
        reports,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit,
        },
      },
    };
  }
}
