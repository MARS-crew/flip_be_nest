import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const dbConfig: {
  type: any;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
} = config.get('db');

export const typeORMConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  timezone: 'Z',
  charset: 'utf8mb4',
  entities: [__dirname + '../../../**/*.entity.{js,ts}'],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};
