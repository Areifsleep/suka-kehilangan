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
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name cannot be empty when provided' })
  @MaxLength(255, { message: 'Full name must not exceed 255 characters' })
  @MinLength(1, { message: 'Full name must be at least 1 character' })
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'NIM must be a string' })
  @MaxLength(255, { message: 'NIM must not exceed 255 characters' })
  @Matches(/^[0-9]+$/, { message: 'NIM must contain only numbers' })
  nim?: string;

  @IsOptional()
  @IsString({ message: 'NIP must be a string' })
  @MaxLength(255, { message: 'NIP must not exceed 255 characters' })
  nip?: string;

  @IsOptional()
  @IsString({ message: 'Study program ID must be a string' })
  studyProgramId?: string;
}

export class ChangePasswordDto {
  @IsString({ message: 'Current password is required' })
  @IsNotEmpty({ message: 'Current password cannot be empty' })
  currentPassword: string;

  @IsString({ message: 'New password is required' })
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  @MaxLength(128, { message: 'New password must not exceed 128 characters' })
  newPassword: string;

  @IsString({ message: 'Confirm password is required' })
  @IsNotEmpty({ message: 'Confirm password cannot be empty' })
  confirmPassword: string;
}
