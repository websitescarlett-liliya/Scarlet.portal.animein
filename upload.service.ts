import { Injectable, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { Request } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const STORAGE_ROOT = process.env.LOCAL_STORAGE_PATH || '/data/uploads';
const TMP_ROOT = path.join(STORAGE_ROOT, 'tmp');
const MAX_SIZE_BYTES = Number(process.env.MAX_UPLOAD_SIZE_MB || 5120) * 1024 * 1024;

@Injectable()
export class UploadService {
  async initUpload(filename: string, fileSize: number, mimeType: string) {
    if (fileSize > MAX_SIZE_BYTES) {
      throw new BadRequestException(
        `File melebihi batas maksimum ${MAX_SIZE_BYTES / 1024 / 1024}MB`,
      );
    }
    const uploadId = randomUUID();
    const dir = path.join(TMP_ROOT, uploadId);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'meta.json'),
      JSON.stringify({ filename, fileSize, mimeType, createdAt: Date.now() }),
    );
    return { uploadId, chunkSizeMb: Number(process.env.CHUNK_SIZE_MB || 10) };
  }

  getReceivedChunks(uploadId: string) {
    const dir = path.join(TMP_ROOT, uploadId);
    if (!fs.existsSync(dir)) return { receivedIndexes: [] };
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.part'));
    const receivedIndexes = files
      .map((f) => Number(f.replace('.part', '')))
      .sort((a, b) => a - b);
    return { receivedIndexes };
  }

  async saveChunk(uploadId: string, index: number, req: Request) {
    const dir = path.join(TMP_ROOT, uploadId);
    if (!fs.existsSync(dir)) {
      throw new BadRequestException('Sesi upload tidak ditemukan, mulai ulang dengan /init');
    }
    const chunkPath = path.join(dir, `${index}.part`);
    const writeStream = fs.createWriteStream(chunkPath);

    await new Promise<void>((resolve, reject) => {
      req.pipe(writeStream);
      req.on('end', resolve);
      req.on('error', reject);
    });

    return { received: index };
  }

  async completeUpload(uploadId: string) {
    const dir = path.join(TMP_ROOT, uploadId);
    const metaPath = path.join(dir, 'meta.json');
    if (!fs.existsSync(metaPath)) {
      throw new BadRequestException('Sesi upload tidak valid');
    }
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

    const finalDir = path.join(STORAGE_ROOT, 'videos');
    fs.mkdirSync(finalDir, { recursive: true });
    const ext = path.extname(meta.filename) || '.mp4';
    const finalFilename = `${uploadId}${ext}`;
    const finalPath = path.join(finalDir, finalFilename);

    const chunkFiles = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.part'))
      .sort((a, b) => Number(a.replace('.part', '')) - Number(b.replace('.part', '')));

    const output = fs.createWriteStream(finalPath);
    for (const chunkFile of chunkFiles) {
      const data = fs.readFileSync(path.join(dir, chunkFile));
      output.write(data);
    }
    output.end();

    await new Promise((resolve) => output.on('finish', resolve));

    // Auto-generate thumbnail dari detik ke-5 video (butuh ffmpeg terpasang di image)
    const thumbFilename = `${uploadId}.jpg`;
    const thumbPath = path.join(STORAGE_ROOT, 'thumbnails', thumbFilename);
    fs.mkdirSync(path.dirname(thumbPath), { recursive: true });
    try {
      await execAsync(
        `ffmpeg -y -i "${finalPath}" -ss 00:00:05 -vframes 1 "${thumbPath}"`,
      );
    } catch (err) {
      // Jika ffmpeg tidak tersedia / gagal, upload tetap sukses tanpa thumbnail otomatis
      console.warn('Auto-thumbnail gagal:', err);
    }

    // Bersihkan chunk sementara
    fs.rmSync(dir, { recursive: true, force: true });

    return {
      videoUrl: `/media/videos/${finalFilename}`,
      thumbnailUrl: fs.existsSync(thumbPath) ? `/media/thumbnails/${thumbFilename}` : null,
    };
  }
}
