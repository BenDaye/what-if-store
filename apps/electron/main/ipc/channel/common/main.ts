import type { IpcMainInvokeEvent, Rectangle } from 'electron';
import { app, BrowserWindow, ipcMain } from 'electron';
import { IpcChannel } from '../types';
import { channelMap } from './map';

class CommonChannel extends IpcChannel {
  protected create(): void {
    ipcMain.handle(channelMap.getAppVersion, (): string => app.getVersion());
    ipcMain.handle(channelMap.getWindowBound, this._getWindowBound);
  }

  protected destroy(): void {
    ipcMain.removeHandler(channelMap.getAppVersion);
    ipcMain.removeHandler(channelMap.getWindowBound);
  }

  private _getWindowBound = (ev: IpcMainInvokeEvent): Rectangle | undefined =>
    BrowserWindow.fromWebContents(ev.sender)?.getBounds();
}

export const commonChannelMain = new CommonChannel();
