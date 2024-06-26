import { createBridgeTRPCClient } from '@what-if-store/bridge/client/trpc';
import { bootstrap } from '@what-if-store/bridge/server/bootstrap';

export const client = createBridgeTRPCClient(bootstrap.port);
