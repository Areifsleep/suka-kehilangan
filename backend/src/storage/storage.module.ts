import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [StorageService, ConfigService],
})
export class StorageModule {}
