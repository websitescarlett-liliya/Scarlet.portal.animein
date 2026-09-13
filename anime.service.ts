import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AnimeService {
  constructor(private prisma: PrismaService) {}

  // Dipakai halaman List Anime: filter genre/studio/tahun/status/skor/season + search + pagination
  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    genre?: string;
    studio?: string;
    year?: number;
    status?: string;
    season?: string;
    sortBy?: 'score' | 'newest' | 'title';
  }) {
    const page = params.page || 1;
    const limit = params.limit || 24;

    const where: any = {};
    if (params.search) where.title = { contains: params.search, mode: 'insensitive' };
    if (params.year) where.year = params.year;
    if (params.status) where.status = params.status;
    if (params.season) where.season = params.season;
    if (params.genre) where.genres = { some: { genre: { slug: params.genre } } };
    if (params.studio) where.studios = { some: { studio: { slug: params.studio } } };

    const orderBy =
      params.sortBy === 'score'
        ? { score: 'desc' as const }
        : params.sortBy === 'title'
        ? { title: 'asc' as const }
        : { createdAt: 'desc' as const };

    const [items, total] = await Promise.all([
      this.prisma.anime.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { genres: { include: { genre: true } } },
      }),
      this.prisma.anime.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }

  findBySlug(slug: string) {
    return this.prisma.anime.findUnique({
      where: { slug },
      include: {
        genres: { include: { genre: true } },
        studios: { include: { studio: true } },
        episodes: { orderBy: { number: 'asc' } },
      },
    });
  }

  create(data: any) {
    return this.prisma.anime.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.anime.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.anime.delete({ where: { id } });
  }
}
