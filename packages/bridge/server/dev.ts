import { createServer } from 'http';
import ws from 'ws';
import { createHTTPHandler } from './adapters/standalone';
import { applyWSSHandler } from './adapters/ws';
import { createContext } from './context';
import { env, launchShutdownTasks, launchStartupTasks, logger } from './modules';
import { appRouter } from './routers/_app';

const _logger = logger.child({}, { msgPrefix: '[Entry] ' });

const httpHandler = createHTTPHandler({ router: appRouter, createContext });
const httpServer = createServer(httpHandler).listen(env.BRIDGE_PORT);

const wsServer = new ws.Server({ server: httpServer });
const wsHandler = applyWSSHandler({ wss: wsServer, router: appRouter, createContext });

wsServer.on('connection', (ws) => {
  _logger.debug(`WebSocket Connection (${wsServer.clients.size})`);
  ws.once('close', () => {
    _logger.debug(`WebSocket Connection (${wsServer.clients.size})`);
  });
});

httpServer.once('listening', async () => {
  await launchStartupTasks();
  _logger.debug(`HTTP Server listening on http://localhost:${env.BRIDGE_PORT} as ${env.NODE_ENV}`);
});

wsServer.once('listening', async () => {
  _logger.debug(`Websocket Server listening on ws://localhost:${env.BRIDGE_PORT} as ${env.NODE_ENV}`);
});

httpServer.on('error', async (err) => {
  _logger.error({ err }, 'Got server error, process will exit');
  await gracefulShutdown();
  process.exit(1);
});

wsServer.on('error', async (err) => {
  _logger.error({ err }, 'Got server error, process will exit');
  await gracefulShutdown();
  process.exit(1);
});

const gracefulShutdown = async () => {
  await launchShutdownTasks().finally(() => {
    wsHandler.broadcastReconnectNotification();
    wsServer.close();
    httpServer.close();
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
