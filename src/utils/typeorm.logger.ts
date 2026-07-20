// src/shared/typeorm.logger.ts
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as util from 'util';
const fileTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/hospital-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '30d',
});
// 2. 定义控制台输出配置
const consoleTransport = new winston.transports.Console();
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf((info) => {
      const { timestamp, level, message } = info;

      const meta = Object.fromEntries(
        Object.entries(info).filter(
          ([key]) => !['timestamp', 'level', 'message'].includes(key),
        ),
      );

      const metaStr =
        Object.keys(meta).length > 0
          ? ' ' +
          util.inspect(meta, {
            depth: null,
            compact: true,
            breakLength: Infinity,
            colors: false,
          })
          : '';

      return `${timestamp} [${level.toUpperCase()}] ${message}${metaStr}`;
    }),
  ),
  transports: [fileTransport, consoleTransport],
});
// export const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp({
//       format: 'YYYY-MM-DD HH:mm:ss',
//     }),
//     winston.format.printf(
//       ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`,
//     ),
//   ),
//   transports: [
//     fileTransport, // 输出到文件
//     consoleTransport, // 输出到控制台
//   ],
// });

export class CustomTypeOrmLogger implements TypeOrmLogger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    // logger.info(`Query: ${query} -- Parameters: ${JSON.stringify(parameters)}`);
    // 将查询语句转换为大写，以便进行不区分大小写的匹配
    const upperQuery = query.toUpperCase();

    // 仅当包含 INSERT, UPDATE, DELETE 关键字时才记录日志
    if (
      upperQuery.includes('INSERT') ||
      upperQuery.includes('UPDATE') ||
      upperQuery.includes('DELETE')
    ) {
      logger.info(`Query: ${query} -- Parameters: ${JSON.stringify(parameters)}`);
    }
    // logger.info(`Query: ${query} -- Parameters: ${JSON.stringify(parameters)}`);
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.error(
      `Query Failed: ${query} -- Error: ${error} -- Parameters: ${JSON.stringify(parameters)}`,
    );
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.warn(`Slow Query (${time}ms): ${query} -- Parameters: ${JSON.stringify(parameters)}`);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    logger.info(`Schema Build: ${message}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    logger.info(`Migration: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    logger.log(level, message);
  }
}
