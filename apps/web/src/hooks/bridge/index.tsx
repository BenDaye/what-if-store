import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useIsClient } from 'usehooks-ts';
import { createBridgeTRPCClient } from '@what-if-store/bridge/client/trpc';

export interface BridgeProviderProps {
  isReady: boolean;
  trpcClient: ReturnType<typeof createBridgeTRPCClient>;
}

const BridgeContext = createContext<BridgeProviderProps>({
  isReady: false,
  trpcClient: undefined as unknown as ReturnType<typeof createBridgeTRPCClient>,
});

export const useBridge = () => useContext(BridgeContext);

export const BridgeProvider = ({ children }: PropsWithChildren) => {
  const isClient = useIsClient();
  const [isReady, setIsReady] = useState(false);
  const [trpcClient] = useState(() => createBridgeTRPCClient(Number(process.env.NEXT_PUBLIC_BRIDGE_PORT)));

  useEffect(() => {
    if (!isClient || !trpcClient) {
      return;
    }

    const checkReady = async () => {
      try {
        await trpcClient.healthCheck.query();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to connect to bridge', error);
      }
    };

    if (!isReady) checkReady();
  }, [isClient, trpcClient, isReady]);
  return <BridgeContext.Provider value={{ isReady, trpcClient }}>{children}</BridgeContext.Provider>;
};
