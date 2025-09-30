// backend/src/management/dto/management.dto.ts
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsUUID,
  Matches,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { LokasiPos } from '@prisma/client';

export class CreateUserDto {
  @IsString({ message: 'Username harus berupa string' })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @MinLength(3, { message: 'Username harus minimal 3 karakter' })
  @MaxLength(255, { message: 'Username tidak boleh melebihi 255 karakter' })
  username: string;

  @IsString({ message: 'Password harus berupa string' })
  @MinLength(8, { message: 'Password harus minimal 8 karakter' })
  @MaxLength(128, { message: 'Password tidak boleh melebihi 128 karakter' })
  password: string;

  @IsUUID('7', { message: 'Role ID harus berupa UUID yang valid' })
  roleId: string;

  @IsEmail({}, { message: 'Email harus berupa alamat email yang valid' })
  @MaxLength(255, { message: 'Email tidak boleh melebihi 255 karakter' })
  email: string;

  @IsString({ message: 'Nama lengkap harus berupa string' })
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
  @MaxLength(255, { message: 'Nama lengkap tidak boleh melebihi 255 karakter' })
  fullName: string;

  @IsOptional()
  @IsString({ message: 'NIM harus berupa string' })
  @MaxLength(255, { message: 'NIM tidak boleh melebihi 255 karakter' })
  @Matches(/^[0-9]+$/, { message: 'NIM hanya boleh berisi angka' })
  nim?: string;

  @IsOptional()
  @IsString({ message: 'NIP harus berupa string' })
  @MaxLength(255, { message: 'NIP tidak boleh melebihi 255 karakter' })
  nip?: string;

  @IsOptional()
  @IsUUID('7', { message: 'Study Program ID harus berupa UUID yang valid' })
  studyProgramId?: string;

  @IsOptional()
  @IsEnum(LokasiPos, {
    message: 'Lokasi pos harus berupa POS_BARAT atau POS_TIMUR',
  })
  lokasiPos?: LokasiPos;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Username harus berupa string' })
  @IsNotEmpty({ message: 'Username tidak boleh kosong ketika disediakan' })
  @MinLength(3, { message: 'Username harus minimal 3 karakter' })
  @MaxLength(255, { message: 'Username tidak boleh melebihi 255 karakter' })
  username?: string;

  @IsOptional()
  @IsUUID('7', { message: 'Role ID harus berupa UUID yang valid' })
  roleId?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email harus berupa alamat email yang valid' })
  @MaxLength(255, { message: 'Email tidak boleh melebihi 255 karakter' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Nama lengkap harus berupa string' })
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong ketika disediakan' })
  @MaxLength(255, { message: 'Nama lengkap tidak boleh melebihi 255 karakter' })
  fullName?: string;

  @IsOptional()
  @IsString({ message: 'NIM harus berupa string' })
  @MaxLength(255, { message: 'NIM tidak boleh melebihi 255 karakter' })
  @Matches(/^[0-9]+$/, { message: 'NIM hanya boleh berisi angka' })
  nim?: string;

  @IsOptional()
  @IsString({ message: 'NIP harus berupa string' })
  @MaxLength(255, { message: 'NIP tidak boleh melebihi 255 karakter' })
  nip?: string;

  @IsOptional()
  @IsUUID('7', { message: 'Study Program ID harus berupa UUID yang valid' })
  studyProgramId?: string;

  @IsOptional()
  @IsEnum(LokasiPos, {
    message: 'Lokasi pos harus berupa POS_BARAT atau POS_TIMUR',
  })
  lokasiPos?: LokasiPos;
}

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page harus berupa angka' })
  @Min(1, { message: 'Page harus minimal 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit harus berupa angka' })
  @Min(1, { message: 'Limit harus minimal 1' })
  @Max(100, { message: 'Limit maksimal 100' })
  limit?: number = 20;

  @IsOptional()
  @IsString({ message: 'Search harus berupa string' })
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsUUID('7', { message: 'Role ID harus berupa UUID yang valid' })
  roleId?: string;

  @IsOptional()
  @IsEnum(LokasiPos, {
    message: 'Lokasi pos harus berupa POS_BARAT atau POS_TIMUR',
  })
  lokasiPos?: LokasiPos;
}

export class ResetPasswordDto {
  @IsString({ message: 'Password baru harus berupa string' })
  @MinLength(8, { message: 'Password baru harus minimal 8 karakter' })
  @MaxLength(128, {
    message: 'Password baru tidak boleh melebihi 128 karakter',
  })
  newPassword: string;
}
