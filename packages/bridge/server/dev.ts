import { ExpressBootstrap } from './bootstrap';
import { env, logger } from './modules';

const bootstrap = new ExpressBootstrap(env.NEXT_PUBLIC_BRIDGE_PORT);

bootstrap.start();

const _logger = logger.child({}, { msgPrefix: '[Bridge] ' });

process.once('SIGINT', async () => {
  _logger.warn('SIGINT');
  await bootstrap.stop();
  process.exit(0);
});

process.once('SIGTERM', async () => {
  _logger.warn('SIGTERM');
  await bootstrap.stop();
  process.exit(0);
});

process.once('uncaughtException', async (err) => {
  _logger.error({ err }, 'Got uncaught exception, process will exit');
  await bootstrap.stop();
  process.exit(1);
});

process.once('unhandledRejection', async (err) => {
  _logger.error({ err }, 'Got unhandled rejection, process will exit');
  await bootstrap.stop();
  process.exit(1);
});
