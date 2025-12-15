import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class MarkDiambilDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama pengambil harus diisi' })
  @MaxLength(255)
  nama_pengambil: string;

  @IsString()
  @IsNotEmpty({ message: 'Identitas pengambil harus diisi' })
  @MaxLength(100)
  identitas_pengambil: string; // NIM, NIP, atau No KTP

  @IsString()
  @IsNotEmpty({ message: 'Kontak pengambil harus diisi' })
  @MaxLength(50)
  kontak_pengambil: string;

  @IsString()
  @IsOptional()
  keterangan_klaim?: string;
}
