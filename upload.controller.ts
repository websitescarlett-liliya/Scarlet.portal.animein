import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

/**
 * Alur chunked upload (dipakai admin panel untuk upload video sampai 5GB):
 *
 * 1. POST /api/upload/init        -> buat sesi upload, dapatkan uploadId
 * 2. PUT  /api/upload/chunk/:id/:index (raw binary body per chunk, mis. 10MB/chunk)
 * 3. GET  /api/upload/status/:id  -> cek chunk index mana saja yang sudah diterima
 *        (dipakai frontend untuk RESUME: lanjut dari chunk terakhir yang belum ada)
 * 4. POST /api/upload/complete/:id -> gabungkan semua chunk jadi 1 file final,
 *        lalu trigger auto-generate thumbnail (lihat upload.service.ts)
 *
 * Chunk disimpan sementara di LOCAL_STORAGE_PATH/tmp/<uploadId>/<index>.part
 * sampai proses complete menggabungkannya secara berurutan menjadi file final.
 */
@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('init')
  init(@Body() body: { filename: string; fileSize: number; mimeType: string }) {
    return this.uploadService.initUpload(body.filename, body.fileSize, body.mimeType);
  }

  @Get('status/:uploadId')
  status(@Param('uploadId') uploadId: string) {
    // Dipakai frontend untuk resume: mengembalikan array index chunk yang sudah diterima
    return this.uploadService.getReceivedChunks(uploadId);
  }

  // Catatan: route ini butuh raw body parser khusus (lihat upload.module.ts),
  // bukan express.json(), karena body-nya adalah binary chunk mentah.
  @Post('chunk/:uploadId/:index')
  async receiveChunk(
    @Param('uploadId') uploadId: string,
    @Param('index') index: string,
    @Req() req: Request,
  ) {
    return this.uploadService.saveChunk(uploadId, Number(index), req);
  }

  @Post('complete/:uploadId')
  async complete(@Param('uploadId') uploadId: string) {
    // Menggabungkan semua chunk + auto-generate thumbnail dari video (via ffmpeg)
    return this.uploadService.completeUpload(uploadId);
  }
}
