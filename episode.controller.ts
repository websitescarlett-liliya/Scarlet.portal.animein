import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('episode')
export class EpisodeController {
  constructor(private readonly service: EpisodeService) {}

  @Get(':animeSlug/:number')
  findOne(@Param('animeSlug') animeSlug: string, @Param('number') number: string) {
    return this.service.findByAnimeAndNumber(animeSlug, Number(number));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Post(':id/server')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  addServer(@Param('id') id: string, @Body() body: any) {
    return this.service.addServer(id, body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
