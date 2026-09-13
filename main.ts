import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  // bodyParser dimatikan default agar upload chunk besar tidak dibaca penuh ke memory;
  // route non-upload memakai express.json() secara eksplisit (lihat app.module.ts)

  app.enableCors({
    origin: process.env.NEXT_PUBLIC_SITE_URL || '*',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const port = process.env.BACKEND_PORT || 4000;
  await app.listen(port);
  console.log(`Scarlet Portal API berjalan di port ${port}`);
}
bootstrap();
