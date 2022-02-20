import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('INFO');
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const serverConfig: { port: string } = config.get('server');
  const port = serverConfig.port || 3000;

  await app.listen(port);

  logger.log(`profile : ${process.env.NODE_ENV || 'development'}`);
  logger.log(`Application running on port : ${port}`);
}
bootstrap();
