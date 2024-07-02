import { contextBridge } from 'electron';
import { apiKey, application, common, winget } from './ipc/renderer';

const handler = {
  common,
  apiKey,
  application,
  winget,
};

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler;
