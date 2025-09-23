import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SeederModule } from './seeder/seeder.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot({}), PrismaModule, AuthModule, SeederModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
