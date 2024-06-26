import { contextBridge } from 'electron';
import { apiKey, application, common } from './ipc/renderer';

const handler = {
  common,
  apiKey,
  application,
};

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler;
