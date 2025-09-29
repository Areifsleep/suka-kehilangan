// backend/src/settings/dto/settings.dto.ts
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsUUID,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Nama lengkap harus berupa string' })
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong ketika disediakan' })
  @MaxLength(255, { message: 'Nama lengkap tidak boleh melebihi 255 karakter' })
  @MinLength(1, { message: 'Nama lengkap harus minimal 1 karakter' })
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email harus berupa alamat email yang valid' })
  @MaxLength(255, { message: 'Email tidak boleh melebihi 255 karakter' })
  email?: string;

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
  @IsString({ message: 'ID program studi harus berupa string' })
  studyProgramId?: string;
}

export class ChangePasswordDto {
  @IsString({ message: 'Kata sandi saat ini diperlukan' })
  @IsNotEmpty({ message: 'Kata sandi saat ini tidak boleh kosong' })
  currentPassword: string;

  @IsString({ message: 'Kata sandi baru diperlukan' })
  @MinLength(8, { message: 'Kata sandi baru harus minimal 8 karakter' })
  @MaxLength(128, {
    message: 'Kata sandi baru tidak boleh melebihi 128 karakter',
  })
  newPassword: string;

  @IsString({ message: 'Konfirmasi kata sandi diperlukan' })
  @IsNotEmpty({ message: 'Konfirmasi kata sandi tidak boleh kosong' })
  confirmPassword: string;
}
