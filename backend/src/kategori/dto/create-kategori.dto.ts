import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateKategoriDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nama: string;

  @IsString()
  @IsOptional()
  deskripsi?: string;
}
