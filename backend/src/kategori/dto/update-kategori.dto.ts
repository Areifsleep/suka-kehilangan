import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateKategoriDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  nama?: string;

  @IsString()
  @IsOptional()
  deskripsi?: string;
}
