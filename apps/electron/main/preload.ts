import { contextBridge } from 'electron';
import { commonChannel } from './ipc';

const handler = {
  common: commonChannel.handlers,
};

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler;
