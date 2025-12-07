import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
  constructor(private configService: ConfigService) {}

  private readonly publicDir = './public/uploads';

  private readonly staticBasePath = 'uploads';

  async uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<string> {
    try {
      const uploadPath = path.join(this.publicDir, folderName);
      if (!fs.existsSync(uploadPath))
        fs.mkdirSync(uploadPath, { recursive: true });

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;

      fs.writeFileSync(path.join(uploadPath, filename), file.buffer);

      // RETURN KEY SAJA (Bukan URL lengkap)
      // Format: "barang-temuan/filename.jpg"
      return `${folderName}/${filename}`;
    } catch (error) {
      throw new InternalServerErrorException('Gagal upload file');
    }
  }

  getPublicUrl(key: string): string {
    // Ambil domain dari .env (http://localhost:3000)
    const baseUrl = this.configService.get<string>('APP_URL');

    // Gabungkan: http://localhost:3000 + /uploads/ + barang-temuan/file.jpg
    return `${baseUrl}/${this.staticBasePath}/${key}`;
  }

  async deleteFile(key: string): Promise<void> {
    // Hapus berdasarkan key
    const fullPath = path.join(this.publicDir, key);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
}
