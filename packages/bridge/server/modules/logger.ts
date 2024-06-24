import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import type { Logger } from 'pino';
import { multistream, pino } from 'pino';
import pretty from 'pino-pretty';
import { env } from './env';

const LOG_DIR = path.join(process.cwd(), 'logs');
if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}

const loggerGlobal = global as typeof global & {
  logger?: Logger;
};

export const logger: Logger =
  loggerGlobal?.logger ??
  pino(
    { level: 'debug' },
    multistream([
      { stream: pretty({ colorize: true, singleLine: false }), level: 'debug' },
      {
        stream: pretty({
          colorize: false,
          mkdir: true,
          destination: path.join(LOG_DIR, 'log.log'),
        }),
        level: 'info',
      },
    ]),
  );

if (env.NODE_ENV !== 'production') {
  loggerGlobal.logger = logger;
}
