import { createBridgeTRPCClient } from '@what-if-store/bridge/client/trpc';
import { bridgeBootstrap } from '@what-if-store/bridge/server';

export const client = createBridgeTRPCClient(bridgeBootstrap.port);
