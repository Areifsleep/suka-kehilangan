import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

function commonConfiguration(app: NestExpressApplication) {
  app.enableShutdownHooks();

  app.set('trust proxy', true);

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.getHttpAdapter().getInstance().disable('etag');

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });
  app.use(cookieParser(process.env.COOKIE_SECRET || undefined));
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    rawBody: true,
  });
  const logger = new Logger('Bootstrap');

  commonConfiguration(app);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Static files now served via ServeStaticModule in AppModule
  logger.log('✅ Static files served via ServeStaticModule');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT') || 1001;

  await app.listen(port);

  logger.log(`🚀 Application running on: http://localhost:${port}`);
  logger.log(`📖 API: http://localhost:${port}/api/v1/...`);
  logger.log(`📁 Static files: http://localhost:${port}/uploads/...`);
}

bootstrap();
