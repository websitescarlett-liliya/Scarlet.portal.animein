import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('ubah_password_ini', 10);

  await prisma.user.upsert({
    where: { email: 'admin@animein.example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@animein.example.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  await prisma.siteSetting.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  });

  const genreAction = await prisma.genre.upsert({
    where: { slug: 'action' },
    update: {},
    create: { slug: 'action', name: 'Action' },
  });

  const studio = await prisma.studio.upsert({
    where: { slug: 'mappa' },
    update: {},
    create: { slug: 'mappa', name: 'MAPPA' },
  });

  const anime = await prisma.anime.upsert({
    where: { slug: 'contoh-anime' },
    update: {},
    create: {
      slug: 'contoh-anime',
      title: 'Contoh Anime',
      synopsis: 'Ini adalah data contoh, ganti/hapus lewat admin panel.',
      status: 'ONGOING',
      score: 8.5,
      year: 2026,
      season: 'Fall 2026',
      genres: { create: [{ genreId: genreAction.id }] },
      studios: { create: [{ studioId: studio.id }] },
    },
  });

  await prisma.episode.upsert({
    where: { animeId_number: { animeId: anime.id, number: 1 } },
    update: {},
    create: {
      animeId: anime.id,
      number: 1,
      title: 'Episode 1',
      skipIntroStart: 0,
      skipIntroEnd: 85,
    },
  });

  console.log('Seed selesai. Login admin: admin@animein.example.com / ubah_password_ini');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
