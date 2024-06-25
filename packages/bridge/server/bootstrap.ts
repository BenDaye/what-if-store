import type { Server } from 'http';
import { WebSocketServer } from 'ws';
import { createHTTPServer } from '../server/adapters/standalone';
import { applyWSSHandler } from '../server/adapters/ws';
import { createContext } from './context';
import { launchShutdownTasks, launchStartupTasks, logger } from './modules';
import { appRouter, type AppRouter } from './routers/_app';

export class Bootstrap {
  public isHttpServerReady: boolean = false;
  public isWsServerReady: boolean = false;

  public port: number;
  private httpHandler?: ReturnType<typeof createHTTPServer>;
  private httpServer?: Server;
  private wsHandler?: ReturnType<typeof applyWSSHandler>;
  private wsServer?: WebSocketServer;

  private _logger = logger.child({}, { msgPrefix: '[Bridge] ' });

  constructor(port?: number) {
    const _port = port ?? Number(process.env.NEXT_PUBLIC_BRIDGE_PORT);
    if (isNaN(_port)) throw new Error('Invalid port number');
    this.port = _port;
  }

  public start() {
    this.httpHandler = createHTTPServer({
      router: appRouter,
      createContext,
    });
    this.httpServer = this.httpHandler.listen(this.port);

    this.httpServer.once('listening', async () => {
      this._logger.debug(`HTTP Server listening on http://localhost:${this.port}`);
      await launchStartupTasks();
      this.isHttpServerReady = true;
    });

    this.httpServer.on('error', async (error: Error) => {
      this._logger.error({ error }, 'Got error, server will be shut down');
      await this.gracefulShutdown();
      await launchShutdownTasks();
    });

    this.wsServer = new WebSocketServer({ server: this.httpServer });
    this.wsHandler = applyWSSHandler<AppRouter>({
      wss: this.wsServer,
      router: appRouter,
      createContext,
    });

    this.wsServer.once('listening', async () => {
      this._logger.debug(`WebSocket Server listening on ws://localhost:${this.port}`);
      this.isWsServerReady = true;
    });

    this.wsServer.on('error', async (error: Error) => {
      this._logger.error({ error }, 'Got error, server will be shut down');
      await this.gracefulShutdown();
    });

    this.wsServer.on('connection', (ws) => {
      this._logger.debug('Connected clients', this.wsServer?.clients.size);
      ws.once('close', () => {
        this._logger.debug('Connected clients', this.wsServer?.clients.size);
      });
    });
  }

  public async stop() {
    await this.gracefulShutdown();
  }

  private async gracefulShutdown() {
    try {
      this.wsHandler?.broadcastReconnectNotification();
      this.wsServer?.close();
      this.httpServer?.close();
    } catch (error) {
      this._logger.error({ error }, 'Got error during shutdown');
    }
    this._logger.warn('Shut down server gracefully');
    this.isHttpServerReady = false;
    this.isWsServerReady = false;
  }
}

export const bootstrap = new Bootstrap();
