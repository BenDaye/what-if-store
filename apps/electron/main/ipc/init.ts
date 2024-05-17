import { BrowserWindow } from 'electron';

export const initializeIpc = (win?: BrowserWindow) => {
  if (win) win.webContents.send('initialize-ipc', 'Hello from main process!');
};
