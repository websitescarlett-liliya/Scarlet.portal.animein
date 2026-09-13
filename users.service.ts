import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.users.findMany();
  }
  findOne(id: string) {
    return this.prisma.users.findUnique({ where: { id } });
  }
  create(data: any) {
    return this.prisma.users.create({ data });
  }
  update(id: string, data: any) {
    return this.prisma.users.update({ where: { id }, data });
  }
  remove(id: string) {
    return this.prisma.users.delete({ where: { id } });
  }
}
