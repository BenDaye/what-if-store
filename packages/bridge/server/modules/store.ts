import type { Emitter } from 'mitt';
import mitt from 'mitt';
import type { InstalledAppsInputSchema } from '../schema';
import { env } from './env';

type InstalledAppsEvent = {
  update: InstalledAppsInputSchema;
  refresh: boolean;
};

const mittGlobal = global as typeof global & {
  installedAppsEmitter?: Emitter<InstalledAppsEvent>;
};

export const installedAppsEmitter = mittGlobal?.installedAppsEmitter ?? mitt<InstalledAppsEvent>();

if (env.NODE_ENV !== 'production') {
  mittGlobal.installedAppsEmitter = installedAppsEmitter;
}

export let installedApps: InstalledAppsInputSchema = [];

export const getInstalledApps = (): InstalledAppsInputSchema => {
  return installedApps;
};

export const setInstalledApps = (apps: InstalledAppsInputSchema) => {
  installedApps = apps;
  installedAppsEmitter.emit('update', apps);
};

export const clearInstalledApps = () => {
  installedApps = [];
  installedAppsEmitter.emit('update', []);
};
