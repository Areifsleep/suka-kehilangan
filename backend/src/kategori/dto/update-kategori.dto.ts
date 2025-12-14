import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateKategoriDto {
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Nama kategori maksimal 255 karakter' })
  nama?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Deskripsi maksimal 500 karakter' })
  deskripsi?: string;
}
