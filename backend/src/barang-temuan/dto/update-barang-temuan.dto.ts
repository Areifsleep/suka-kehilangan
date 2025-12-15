import {
  IsString,
  IsOptional,
  IsDateString,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class UpdateBarangTemuanDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  nama_barang?: string;

  @IsString()
  @IsOptional()
  kategori_id?: string;

  @IsString()
  @IsOptional()
  deskripsi?: string;

  @IsDateString()
  @IsOptional()
  tanggal_ditemukan?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  lokasi_umum?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  lokasi_spesifik?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  perkiraan_waktu_ditemukan?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  nama_penemu?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  nomor_hp_penemu?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  identitas_penemu?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email_penemu?: string;

  @IsString()
  @IsOptional()
  catatan_penemu?: string;
}
