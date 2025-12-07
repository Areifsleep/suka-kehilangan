import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
