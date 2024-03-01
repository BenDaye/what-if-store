import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { appLogger } from './pino';

const _logger = appLogger.child(
  {},
  {
    msgPrefix: '[Prisma] ',
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
);

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  prismaGlobal.prisma ??
  ((): PrismaClient => {
    const _prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
      errorFormat: env.NODE_ENV === 'development' ? 'pretty' : 'colorless',
    });

    _prisma.$on('query', (ev) => {
      _logger.debug(ev, 'Query');
    });
    _prisma.$on('error', (ev) => {
      _logger.error(ev, 'Error');
    });
    _prisma.$on('info', (ev) => {
      _logger.info(ev, 'Info');
    });
    _prisma.$on('warn', (ev) => {
      _logger.warn(ev, 'Warn');
    });

    return _prisma;
  })();

if (env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}
