import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class GenreService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.genre.findMany();
  }
  findOne(id: string) {
    return this.prisma.genre.findUnique({ where: { id } });
  }
  create(data: any) {
    return this.prisma.genre.create({ data });
  }
  update(id: string, data: any) {
    return this.prisma.genre.update({ where: { id }, data });
  }
  remove(id: string) {
    return this.prisma.genre.delete({ where: { id } });
  }
}
