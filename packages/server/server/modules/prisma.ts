import { PrismaClient } from '@what-if-store/prisma';
import { env } from './env';
import { logger } from './logger';

const _logger = logger.child(
  {},
  {
    msgPrefix: '[Prisma] ',
    level: env.NODE_ENV === 'production' ? 'warn' : 'info',
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
