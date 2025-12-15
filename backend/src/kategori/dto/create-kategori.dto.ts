import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateKategoriDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama kategori harus diisi' })
  @MaxLength(255, { message: 'Nama kategori maksimal 255 karakter' })
  nama: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Deskripsi maksimal 500 karakter' })
  deskripsi?: string;
}
