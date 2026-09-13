import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class StudioService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.studio.findMany();
  }
  findOne(id: string) {
    return this.prisma.studio.findUnique({ where: { id } });
  }
  create(data: any) {
    return this.prisma.studio.create({ data });
  }
  update(id: string, data: any) {
    return this.prisma.studio.update({ where: { id }, data });
  }
  remove(id: string) {
    return this.prisma.studio.delete({ where: { id } });
  }
}
