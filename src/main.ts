import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  const { port } = config.get('server');
  const serverPort = port || 3000;

  await app.listen(serverPort);

  logger.log(`profile : ${process.env.NODE_ENV || 'development'}`);
  logger.log(`Application running on port : ${serverPort}`);
}
bootstrap();
