import * as moment from 'moment';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { format, Logform, transports } from 'winston';

export class LoggerConfig {
  static createApplicationLogger({ env = 'development' }) {
    return WinstonModule.createLogger({
      format: format.combine(
        format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('FLIP'),
      ),
      transports: [
        new transports.Console({}),
        new transports.File({
          level: 'error',
          filename: `error-${moment(new Date()).format('YYYY-MM-DD')}.log`,
          dirname: 'logs',
          maxsize: 5000000,
          format:
            env === 'production'
              ? this.productionLogFileFormat()
              : this.developmentLogFileFormat(),
        }),
        new transports.File({
          filename: `application-${moment(new Date()).format(
            'YYYY-MM-DD',
          )}.log`,
          dirname: 'logs',
          maxsize: 5000000,
          format:
            env === 'production'
              ? this.productionLogFileFormat()
              : this.developmentLogFileFormat(),
        }),
      ],
    });
  }

  static productionLogFileFormat(): Logform.Format {
    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf((info) => JSON.stringify(info)),
    );
  }

  static developmentLogFileFormat(): Logform.Format {
    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf((info) => JSON.stringify(info)),
    );
  }
}
