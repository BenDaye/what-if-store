import { BrowserWindow } from 'electron';
import { apiKey, common } from './channel';

export const initializeIpc = (win?: BrowserWindow) => {
  if (win) win.webContents.send('initialize-ipc', 'Hello from main process!');

  common.initialize();
  apiKey.initialize();
};
