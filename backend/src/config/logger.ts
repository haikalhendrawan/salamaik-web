import { createLogger, format, transports } from 'winston';
import path from 'path';

const loggerTransports = [];

const levelIdentifier = {
  info: '📘',
  debug: '📗',
  error: '📕',
  warn: '📒'
};

if (process.env.NODE_ENV === 'production') {
  loggerTransports.push(
    new transports.File({
      filename: path.join(__dirname, '..', 'logfile.txt'),
      level: 'error',
    }),
    new transports.File({ filename: path.join(__dirname, '..', 'logfile.txt') })
  );
} else {
  loggerTransports.push(
    new transports.Console({
      stderrLevels: ['error']
    })
  );
}


const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${levelIdentifier[level as keyof typeof levelIdentifier]} ${level.toUpperCase()}] ${message} ${
        stack ? `\n${stack}` : ''
      }`;
    })
  ),
  transports: loggerTransports
});

export default logger;