import { LoggerService } from '@nestjs/common';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { format, Logform, transport, transports } from 'winston';
import 'winston-daily-rotate-file';

export class LoggerConfig {
  public static createApplicationLoggerService(): LoggerService {
    return WinstonModule.createLogger({
      format: format.combine(
        format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('FLIP'),
      ),
      transports: this.transports(),
    });
  }

  private static transports(): transport[] {
    return [
      new transports.Console({}),
      new transports.DailyRotateFile({
        ...this.logDefaultConfig(),
        format: this.logFileFormat(),
        filename: 'application-%DATE%.log',
      }),
      new transports.DailyRotateFile({
        ...this.logDefaultConfig(),
        format: this.logFileFormat(),
        level: 'error',
        filename: 'error-%DATE%.log',
      }),
    ];
  }

  private static logDefaultConfig(): {
    dirname: string;
    datePattern: string;
    zippedArchive: boolean;
    maxSize: string;
    maxFiles: string;
  } {
    return {
      dirname: 'logs',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    };
  }

  private static logFileFormat(): Logform.Format {
    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf((info) => JSON.stringify(info)),
    );
  }
}
