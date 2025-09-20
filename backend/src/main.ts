import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

function commonConfiguration(app: NestExpressApplication) {
  app.enableShutdownHooks();

  app.set('trust proxy', true);

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.getHttpAdapter().getInstance().disable('etag');

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  app.use(cookieParser(process.env.COOKIE_SECRET || undefined));
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  commonConfiguration(app);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT') || 1001;

  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
