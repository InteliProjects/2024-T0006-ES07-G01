import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalFilters();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(5000);
}
bootstrap();
