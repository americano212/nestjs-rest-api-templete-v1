import { Logger as NestLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { middleware } from './app.middleware';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { APIDocument } from './swagger.docs';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<string> {
  const isProduction = process.env['NODE_ENV'] === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  if (isProduction) {
    app.enable('trust proxy');
  } else {
    const documentConfig = new APIDocument().initializeOptions();
    const document = SwaggerModule.createDocument(app, documentConfig);
    SwaggerModule.setup('api', app, document); // http://localhost/api
  }
  middleware(app);

  app.enableCors();
  await app.listen(process.env['PORT'] || 3000);

  return app.getUrl();
}

void (async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
    console.log('[SUCCESS]', url);
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
    console.log('[ERROR]', error);
  }
})();
