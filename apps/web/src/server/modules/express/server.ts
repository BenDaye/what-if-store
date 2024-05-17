import { IncomingMessage, Server, ServerResponse } from 'node:http';
import * as trpcExpress from '@trpc/server/adapters/express';
import bodyParser from 'body-parser';
import express from 'express';
import { appRouter } from '../../routers/_app';
import { env } from '../env';
import { appLogger } from '../pino';
import { createContext } from './context';

const _logger = appLogger.child({}, { msgPrefix: '[tRPC] [Express] ' });

let server: Server<typeof IncomingMessage, typeof ServerResponse> | null = null;

export const startUpExpress = async (): Promise<string> =>
  new Promise((res, rej) => {
    try {
      const app = express();

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      // app.use((req, res, next) => {
      //   const args = { ...req.params, ...req.query, ...req.body };
      // });

      app.use(
        '/trpc',
        trpcExpress.createExpressMiddleware({
          router: appRouter,
          createContext,
        }),
      );

      server = app.listen(env.EXPRESS_PORT ?? 3003, () => {
        _logger.info(
          `Server listening on ${env.EXPRESS_PORT} as ${env.NODE_ENV}`,
        );
        res('Express');
      });
    } catch (error) {
      rej(error);
    }
  });

export const shutDownExpress = async (): Promise<string> =>
  new Promise((res, rej) => {
    server?.close((err) => {
      if (err) {
        rej(err);
      }
      _logger.warn(`Server closed`);
      res('Express');
    });
  });
