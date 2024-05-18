import { contextBridge } from 'electron';
import { apiKeyChannel, commonChannel } from './ipc';

const handler = {
  common: commonChannel.handlers,
  apiKey: apiKeyChannel.handlers,
};

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler;
