import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class EpisodeService {
  constructor(private prisma: PrismaService) {}

  findByAnimeAndNumber(animeSlug: string, number: number) {
    return this.prisma.episode.findFirst({
      where: { anime: { slug: animeSlug }, number },
      include: { servers: { orderBy: { order: 'asc' } } },
    });
  }

  create(data: any) {
    return this.prisma.episode.create({ data });
  }

  addServer(episodeId: string, data: any) {
    return this.prisma.episodeServer.create({ data: { ...data, episodeId } });
  }

  update(id: string, data: any) {
    return this.prisma.episode.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.episode.delete({ where: { id } });
  }
}
