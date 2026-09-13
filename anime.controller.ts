import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.animeService.findAll({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 24,
      search: query.search,
      genre: query.genre,
      studio: query.studio,
      year: query.year ? Number(query.year) : undefined,
      status: query.status,
      season: query.season,
      sortBy: query.sortBy,
    });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.animeService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(@Body() body: any) {
    return this.animeService.create(body);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(@Param('id') id: string, @Body() body: any) {
    return this.animeService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.animeService.remove(id);
  }
}
