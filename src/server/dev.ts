import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { createServer } from 'http';
import path from 'path';
import { default as serveHandler } from 'serve-handler';
import ws from 'ws';
import { createContext } from './context';
import {
  appLogger,
  env,
  launchShutdownTasks,
  launchStartupTasks,
  redis,
} from './modules';
import { appRouter } from './routers/_app';

const _logger = appLogger.child({}, { msgPrefix: '[Entry] ' });

const server = createServer(async (req, res) =>
  serveHandler(req, res, {
    public: path.join(process.cwd(), '/uploads'),
  }),
);

const wss = new ws.Server({ port: env.WS_PORT });
const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on('connection', (ws) => {
  _logger.debug(`WebSocket Connection (${wss.clients.size})`);
  ws.once('close', () => {
    _logger.debug(`WebSocket Connection (${wss.clients.size})`);
  });
});
_logger.debug(`WebSocket Server listening on ${env.NEXT_PUBLIC_WS_URL}`);

redis.once('ready', async () => {
  await launchStartupTasks();
});

const gracefulShutdown = async () => {
  await launchShutdownTasks().finally(() => {
    handler.broadcastReconnectNotification();
    wss.close();
    server.close();
    _logger.info('process exited');
  });
};

process.once('SIGINT', async () => {
  _logger.warn('SIGINT');
  await gracefulShutdown();
  process.exit(0);
});

process.once('SIGTERM', async () => {
  _logger.warn('SIGTERM');
  await gracefulShutdown();
  process.exit(0);
});

process.once('uncaughtException', async (err) => {
  _logger.error({ err }, 'Got uncaught exception, process will exit');
  await gracefulShutdown();
  process.exit(1);
});

process.once('unhandledRejection', async (err) => {
  _logger.error({ err }, 'Got unhandled rejection, process will exit');
  await gracefulShutdown();
  process.exit(1);
});

server.once('error', async (err) => {
  _logger.error({ err }, 'Got server error, process will exit');
  await gracefulShutdown();
  process.exit(1);
});

server.listen(env.SERVER_PORT ?? 3002, () => {
  _logger.info(
    `Serve listening on ${env.NEXT_PUBLIC_SERVER_URL} as ${env.NODE_ENV}`,
  );
});
