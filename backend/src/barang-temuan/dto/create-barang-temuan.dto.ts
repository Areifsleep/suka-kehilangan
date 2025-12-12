import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class CreateBarangTemuanDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama barang harus diisi' })
  @MaxLength(255)
  nama_barang: string;

  @IsString()
  @IsNotEmpty({ message: 'Kategori harus dipilih' })
  kategori_id: string;

  @IsString()
  @IsOptional()
  deskripsi?: string;

  @IsString()
  @IsNotEmpty({ message: 'Lokasi ditemukan harus diisi' })
  @MaxLength(255)
  lokasi_ditemukan: string;

  @IsDateString({}, { message: 'Format tanggal tidak valid' })
  @IsNotEmpty({ message: 'Tanggal ditemukan harus diisi' })
  tanggal_ditemukan: string;

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

  // Data Penemu (yang menyerahkan barang ke satpam)
  @IsString()
  @IsNotEmpty({ message: 'Nama penemu harus diisi' })
  @MaxLength(255)
  nama_penemu: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor HP penemu harus diisi' })
  @MaxLength(50)
  nomor_hp_penemu: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  identitas_penemu?: string; // NIM, NIP, atau No KTP

  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsOptional()
  @MaxLength(255)
  email_penemu?: string;

  @IsString()
  @IsOptional()
  catatan_penemu?: string;
}
