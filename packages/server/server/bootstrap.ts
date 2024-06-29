import type { Server } from 'http';
import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { WebSocketServer, type WebSocket } from 'ws';
import { createExpressMiddleware } from '../server/adapters/express';
import { createHTTPServer } from '../server/adapters/standalone';
import { applyWSSHandler } from '../server/adapters/ws';
import { createContext } from './context';
import { launchShutdownTasks, launchStartupTasks, logger } from './modules';
import { appRouter, type AppRouter } from './routers/_app';

class BaseBootstrap {
  public isHttpServerReady: boolean = false;
  public isWsServerReady: boolean = false;

  public port: number;
  protected _httpHandler?: ReturnType<typeof createHTTPServer>;
  protected _httpServer?: Server;
  protected _wsHandler?: ReturnType<typeof applyWSSHandler>;
  protected _wsServer?: WebSocketServer;

  protected _logger = logger.child({}, { msgPrefix: '[Server] ' });

  constructor(port?: number) {
    const _port = port ?? Number(process.env.NEXT_PUBLIC_SERVER_PORT);
    if (isNaN(_port)) throw new Error('Invalid port number');
    this.port = _port;
  }

  public stop = async () => {
    await this.gracefulShutdown();
  };

  protected addHttpServerListeners = () => {
    this._httpServer?.once('listening', this.onHttpServerListening);
    this._httpServer?.on('error', this.onHttpServerError);
  };

  protected removeHttpServerListeners = () => {
    this._httpServer?.off('listening', this.onHttpServerListening);
    this._httpServer?.off('error', this.onHttpServerError);
  };

  protected onHttpServerListening = async () => {
    await launchStartupTasks();
    this._logger.debug(`HTTP Server listening on http://localhost:${this.port}`);
    this.isHttpServerReady = true;
  };

  protected onHttpServerError = async (error: Error) => {
    this._logger.error({ error }, 'Got error, server will be shut down');
    await this.gracefulShutdown();
    await launchShutdownTasks();
  };

  protected addWsServerListeners = () => {
    this._wsServer?.once('listening', this.onWsServerListening);
    this._wsServer?.on('error', () => this.onWsServerError);
    this._wsServer?.on('connection', this.onWsServerConnection);
  };

  protected removeWsServerListeners = () => {
    this._wsServer?.off('listening', this.onWsServerListening);
    this._wsServer?.off('error', this.onWsServerError);
    this._wsServer?.off('connection', this.onWsServerConnection);
  };

  protected onWsServerListening = () => {
    this._logger.debug(`WebSocket Server listening on ws://localhost:${this.port}`);
    this.isWsServerReady = true;
  };

  protected onWsServerError = async (error: Error) => {
    this._logger.error({ error }, 'Got error, server will be shut down');
    await this.gracefulShutdown();
  };

  protected onWsServerConnection = (ws: WebSocket) => {
    this._logger.debug(`Connected clients: ${this._wsServer?.clients.size}`);
    ws.once('close', () => {
      this._logger.debug(`Connected clients: ${this._wsServer?.clients.size}`);
    });
  };

  protected gracefulShutdown = async () => {
    try {
      this.removeWsServerListeners();
      this.removeHttpServerListeners();

      this._wsHandler?.broadcastReconnectNotification();
      this._wsServer?.close();
      this._httpHandler?.closeAllConnections();
      this._httpServer?.close();
    } catch (error) {
      this._logger.error({ error }, 'Got error during shutdown');
    }
    this._logger.warn('Shut down server gracefully');
    this.isHttpServerReady = false;
    this.isWsServerReady = false;
  };

  protected startHttpServer = (): void => {
    throw new Error('Not implemented');
  };

  protected startWsServer = (): void => {
    if (!this._httpServer) {
      this._logger.warn('Missing http server');
      return;
    }
    const wsServer = new WebSocketServer({ server: this._httpServer });
    const wsHandler = applyWSSHandler<AppRouter>({
      wss: wsServer,
      router: appRouter,
      createContext,
    });
    this._wsHandler = wsHandler;
    this._wsServer = wsServer;
    this.addWsServerListeners();
  };

  public start = () => {
    this.startHttpServer();
    this.startWsServer();
  };
}

export class StandaloneBootstrap extends BaseBootstrap {
  constructor(port?: number) {
    super(port);
  }

  protected startHttpServer = () => {
    const httpHandler = createHTTPServer({
      middleware: cors(),
      router: appRouter,
      createContext,
    });
    const httpServer = httpHandler.listen(this.port);
    this._httpHandler = httpHandler;
    this._httpServer = httpServer;
    this.addHttpServerListeners();
  };
}

export const standaloneBootstrap = new StandaloneBootstrap();

export class ExpressBootstrap extends BaseBootstrap {
  constructor(port?: number) {
    super(port);
  }

  protected startHttpServer = () => {
    const app = express();
    app.use(cors());
    const limiter = rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      skip: (req) => req.url === '/healthCheck',
    });
    app.use(limiter);
    app.use('/', createExpressMiddleware({ router: appRouter, createContext }));

    const httpHandler = app.listen(this.port);
    const httpServer = httpHandler;
    this._httpHandler = httpHandler;
    this._httpServer = httpServer;
    this.addHttpServerListeners();
  };
}

export const expressBootstrap = new ExpressBootstrap();
