import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export enum ReportType {
  LOST = 'LOST',
  FOUND = 'FOUND',
}

export enum ReportStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  OPEN = 'OPEN',
  CLAIMED = 'CLAIMED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

export class CreateReportDto {
  @IsString()
  item_name: string;

  @IsUUID()
  report_category_id: string;

  @IsString()
  description: string;

  @IsString()
  place_found: string;

  @IsOptional()
  @IsString()
  specific_location?: string;

  @IsDateString()
  lost_date: string;

  @IsOptional()
  @IsString()
  lost_time?: string;

  @IsOptional()
  @IsString()
  additional_notes?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsEnum(ReportType)
  report_type: ReportType;
}

export class GetReportsQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
