import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(username: string, email: string, password: string) {
    const exists = await this.prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (exists) throw new ConflictException('Email atau username sudah dipakai');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { username, email, passwordHash },
    });
    return { id: user.id, username: user.username, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Email atau password salah');
    }
    if (user.status === 'BANNED') {
      throw new UnauthorizedException('Akun Anda telah dibanned');
    }
    const accessToken = this.jwt.sign({ sub: user.id, username: user.username, role: user.role });
    return { accessToken, user: { id: user.id, username: user.username, role: user.role } };
  }
}
