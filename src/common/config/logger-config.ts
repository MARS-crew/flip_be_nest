import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { format, Logform, transports } from 'winston';
import 'winston-daily-rotate-file';
export class LoggerConfig {
  static createApplicationLogger({ env = 'development' }) {
    return WinstonModule.createLogger({
      format: format.combine(
        format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('FLIP'),
      ),
      transports: [
        new transports.Console({}),
        new transports.DailyRotateFile({
          filename: 'application-%DATE%.log',
          dirname: 'logs',
          datePattern: 'YYYY-MM-DD-HH',
          format:
            env === 'production'
              ? this.productionLogFileFormat()
              : this.developmentLogFileFormat(),
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        new transports.DailyRotateFile({
          level: 'error',
          filename: 'error-%DATE%.log',
          dirname: 'logs',
          datePattern: 'YYYY-MM-DD-HH',
          format:
            env === 'production'
              ? this.productionLogFileFormat()
              : this.developmentLogFileFormat(),
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
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
