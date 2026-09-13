import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AnimeModule } from './anime/anime.module';
import { EpisodeModule } from './episode/episode.module';
import { GenreModule } from './genre/genre.module';
import { StudioModule } from './studio/studio.module';
import { UploadModule } from './upload/upload.module';
import { SettingsModule } from './settings/settings.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    // Rate limit global: default dari .env, bisa dioverride per-route dengan @Throttle()
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.RATE_LIMIT_TTL || 60) * 1000,
        limit: Number(process.env.RATE_LIMIT_MAX || 100),
      },
    ]),
    PrismaModule,
    AnimeModule,
    EpisodeModule,
    GenreModule,
    StudioModule,
    UploadModule,
    SettingsModule,
    AuthModule,
    UsersModule,
    CommentsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
