import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SeederModule } from './seeder/seeder.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { ManagementModule } from './management/management.module';
import { BarangTemuanModule } from './barang-temuan/barang-temuan.module';
import { KategoriModule } from './kategori/kategori.module';
import { StorageModule } from './storage/storage.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    // Serve static files from public directory
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'), // From dist/src -> backend/public
      serveRoot: '/',
      exclude: ['/api*'], // Exclude API routes from static file serving
    }),
    PrismaModule,
    AuthModule,
    SeederModule,
    UserModule,
    ProfileModule,
    ManagementModule,
    BarangTemuanModule,
    KategoriModule,
    StorageModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
