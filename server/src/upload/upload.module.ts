// server/src/upload/upload.module.ts
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { R2Service } from '../storage/r2.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, R2Service],
  exports: [UploadService, R2Service],
})
export class UploadModule {}
