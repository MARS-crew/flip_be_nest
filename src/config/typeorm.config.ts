import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const { type, host, port, username, password, database } = config.get('db');

export const typeORMConfig: TypeOrmModuleOptions = {
  type: type,
  host: host,
  port: port,
  username: username,
  password: password,
  database: database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
