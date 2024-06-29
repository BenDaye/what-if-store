import { getInstalledApps } from 'get-installed-apps';
import { type Unsubscribable } from '@what-if-store/bridge/server';
import { getInstalledApps as getInstalledAppsFromStore, setInstalledApps } from '../store/application';
import { client } from './bridge';

let Unsubscribe: Unsubscribable;

export const overrideInstalledApps = async () => {
  const apps = await getInstalledApps();
  setInstalledApps(apps);
};

export const syncInstalledAppsToBridge = async (override?: boolean) => {
  if (override) await overrideInstalledApps();

  const apps = getInstalledAppsFromStore();
  await client.application.setInstalledApps.mutate(apps);
};

export const connectBridgeWsServer = () => {
  Unsubscribe = client.application.electronSubscription.subscribe(undefined, {
    onData: syncInstalledAppsToBridge,
    onError: (error) => console.error(error),
    onStarted: () => console.log('Connected to bridge WS server'),
    onStopped: () => console.log('Disconnected from bridge WS server'),
    onComplete: () => console.log('Completed bridge WS server connection'),
  });
};

export const disconnectBridgeWsServer = () => {
  Unsubscribe?.unsubscribe();
};

export const startup = async () => {
  await Promise.allSettled([syncInstalledAppsToBridge(true), connectBridgeWsServer()])
    .then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') console.error(result.reason);
      });
      console.log('Startup tasks completed');
    })
    .catch((error) => console.error(error));
};

export const shutdown = async () => {
  await Promise.allSettled([disconnectBridgeWsServer()])
    .then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') console.error(result.reason);
      });
      console.log('Shut down tasks completed');
    })
    .catch((error) => console.error(error));
};
