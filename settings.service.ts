import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.siteSetting.findUnique({
      where: { id: 'singleton' },
    });
    if (!settings) {
      settings = await this.prisma.siteSetting.create({ data: { id: 'singleton' } });
    }
    return settings;
  }

  async updateSettings(dto: UpdateSettingsDto) {
    return this.prisma.siteSetting.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...dto },
      update: dto,
    });
  }
}
