import { contextBridge } from 'electron';
import { apiKey, common } from './ipc/renderer';

const handler = {
  common,
  apiKey,
};

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler;
