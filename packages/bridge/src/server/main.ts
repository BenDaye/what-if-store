import { Server } from 'http';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';
import { createContext } from './context';
import { AppRouter, appRouter } from './routers/_app';
import { StartTRPCServerProps, startTRPCServerProps } from './schema';

let server: Server,
  wss: WebSocketServer,
  handler: ReturnType<typeof applyWSSHandler>;

export const startTRPCServer = async (props?: StartTRPCServerProps) => {
  const validateProps = await startTRPCServerProps.safeParseAsync(props);
  if (!validateProps.success) {
    throw new Error(validateProps.error.errors.join('\n'));
  }

  const { port } = validateProps.data;

  server = createHTTPServer({
    router: appRouter,
    createContext,
  });

  wss = new WebSocketServer({ server });
  handler = applyWSSHandler<AppRouter>({
    wss,
    router: appRouter,
    createContext,
  });

  wss.on('connection', (ws) => {
    console.log('Connected clients', wss.clients.size);
    ws.once('close', () => {
      console.log('Connected clients', wss.clients.size);
    });
  });

  server.listen(port, () => {
    console.log(`Bridge Server listening on port ${port}`);
  });
  server.on('error', (error: NodeJS.ErrnoException) => {
    console.error(error);
    handler.broadcastReconnectNotification();
  });
};

export const stopTRPCServer = async () => {
  if (typeof handler !== 'undefined') handler.broadcastReconnectNotification();
  if (typeof wss !== 'undefined') wss.close();
  if (typeof server !== 'undefined') server.close();

  console.log('Bridge Server stopped');
};
