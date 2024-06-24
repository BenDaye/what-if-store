import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useIsClient } from 'usehooks-ts';

// import { createBridgeTRPCClient } from '@what-if-store/electron/main/bridge/client';

export interface BridgeProviderProps {
  isReady: boolean;
  // trpcClient: ReturnType<typeof createBridgeTRPCClient>;
}

const BridgeContext = createContext<BridgeProviderProps>({
  isReady: false,
  // trpcClient: undefined as unknown as ReturnType<typeof createBridgeTRPCClient>,
});

export const useBridge = () => useContext(BridgeContext);

export const BridgeProvider = ({ children }: PropsWithChildren) => {
  const isClient = useIsClient();
  const [isReady, setIsReady] = useState(false);
  // const [trpcClient] = useState(() => createBridgeTRPCClient());

  // useEffect(() => {
  //   if (!isClient || !trpcClient) {
  //     return;
  //   }

  //   const checkReady = async () => {
  //     try {
  //       await trpcClient.systemInformation.version.query();
  //       setIsReady(true);
  //     } catch (error) {
  //       console.error('Failed to connect to bridge', error);
  //     }
  //   };

  //   checkReady();
  // }, [isClient, trpcClient]);
  return <BridgeContext.Provider value={{ isReady }}>{children}</BridgeContext.Provider>;
};
