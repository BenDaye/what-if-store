import { createServer } from 'http';
import path from 'path';
import { default as serveHandler } from 'serve-handler';
import { ExpressBootstrap } from './bootstrap';
import { env, logger } from './modules';

const bootstrap = new ExpressBootstrap(env.NEXT_PUBLIC_SERVER_PORT);

bootstrap.start();

const _logger = logger.child({}, { msgPrefix: '[Server] ' });

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

const uploadStaticServer = createServer(async (req, res) =>
  serveHandler(req, res, {
    public: path.join(process.cwd(), '/uploads'),
  }),
);

uploadStaticServer.once('error', async (err) => {
  _logger.error({ err }, 'Got uploadStaticServer error, process will exit');
  uploadStaticServer.close();
  process.exit(1);
});

uploadStaticServer.listen(env.NEXT_PUBLIC_STATIC_PORT, () => {
  _logger.info(`uploadStaticServer listening on ${env.NEXT_PUBLIC_STATIC_HTTP_URL} as ${env.NODE_ENV}`);
});
