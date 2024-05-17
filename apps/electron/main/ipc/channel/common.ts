import {
  app,
  BrowserWindow,
  ipcMain,
  IpcMainInvokeEvent,
  ipcRenderer,
  Rectangle,
} from 'electron';
import { IpcChannel } from './types';

class CommonChannel extends IpcChannel {
  private _channelMap = {
    getAppVersion: 'common:app_version:get',
    getWindowBound: 'common:window_bound:get',
  } as const;

  protected create(): void {
    ipcMain.handle(this._channelMap.getAppVersion, (): string =>
      app.getVersion(),
    );
    ipcMain.handle(this._channelMap.getWindowBound, this._getWindowBound);
  }

  protected destroy(): void {
    ipcMain.removeHandler(this._channelMap.getAppVersion);
    ipcMain.removeHandler(this._channelMap.getWindowBound);
  }

  public handlers = {
    getAppVersion: (): Promise<string> =>
      ipcRenderer.invoke(this._channelMap.getAppVersion) as Promise<string>,
    getWindowBound: (): Promise<Rectangle | undefined> =>
      ipcRenderer.invoke(this._channelMap.getWindowBound) as Promise<
        Rectangle | undefined
      >,
  };

  private _getWindowBound = (ev: IpcMainInvokeEvent): Rectangle | undefined =>
    BrowserWindow.fromWebContents(ev.sender)?.getBounds();
}

export const commonChannel = new CommonChannel();
