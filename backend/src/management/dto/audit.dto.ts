import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportStatus, ReportType } from '@prisma/client';

export class AuditReportsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(['today', 'week', 'month', 'all'])
  dateRange?: string = 'all';

  @IsOptional()
  @IsEnum(ReportType)
  reportType?: ReportType;
}

export class ExportAuditReportsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(['today', 'week', 'month', 'all'])
  dateRange?: string = 'all';

  @IsOptional()
  @IsEnum(ReportType)
  reportType?: ReportType;
}
