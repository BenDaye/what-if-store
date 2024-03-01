import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { createServer } from 'http';
import type { Socket } from 'net';
import next from 'next';
import { parse } from 'url';
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

const dev = env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    const proto = req.headers['x-forwarded-proto'];
    if (proto && proto === 'http') {
      // redirect to ssl
      res.writeHead(303, {
        location: `https://` + req.headers.host + (req.headers.url ?? ''),
      });
      res.end();
      return;
    }

    const parsedUrl = parse(req.url!, true);
    await handle(req, res, parsedUrl);
  });
  const wss = new ws.Server({ server });
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

  server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket as Socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });

  server.listen(env.APP_PORT, () => {
    _logger.info(
      `Server listening on http://localhost:${env.APP_PORT} as ${env.NODE_ENV}`,
    );
  });
});
