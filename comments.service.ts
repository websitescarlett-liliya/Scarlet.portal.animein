import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.comments.findMany();
  }
  findOne(id: string) {
    return this.prisma.comments.findUnique({ where: { id } });
  }
  create(data: any) {
    return this.prisma.comments.create({ data });
  }
  update(id: string, data: any) {
    return this.prisma.comments.update({ where: { id }, data });
  }
  remove(id: string) {
    return this.prisma.comments.delete({ where: { id } });
  }
}
