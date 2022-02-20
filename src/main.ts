import { Logger, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { AppModule } from './app.module';
import { LoggerConfig } from './common/config/logger-config';

const logger = new Logger('INFO');
const serverConfig: { port: string } = config.get('server');

async function bootstrap() {
  const appOptions: NestApplicationOptions = {
    cors: true,
    logger: LoggerConfig.createApplicationLoggerService(),
  };

  const app = await NestFactory.create(AppModule, appOptions);

  const port = serverConfig.port || 3000;

  await app.listen(port);

  logger.log(`profile : ${process.env.NODE_ENV || 'development'}`);
  logger.log(`Application running on port : ${port}`);
}
bootstrap();
