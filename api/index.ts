import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../backend/src/app.module';
import { TransformInterceptor } from '../backend/src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../backend/src/common/filters/http-exception.filter';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let app: any;

async function createNestServer(expressInstance: express.Express) {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));
    app.setGlobalPrefix('api');
    app.enableCors({
      origin: true,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  }
  return app;
}

export default async function handler(req: any, res: any) {
  await createNestServer(server);
  server(req, res);
}
