import { ipcMain, IpcMainInvokeEvent, ipcRenderer } from 'electron';
import {
  clearApiKey,
  createApiKey,
  getApiKey,
  hasApiKey,
  removeApiKey,
  setApiKey,
} from '../../store';
import { IpcChannel } from './types';

class ApiKeyChannel extends IpcChannel {
  private _channelMap = {
    get: 'api_key:get',
    set: 'api_key:set',
    clear: 'api_key:clear',
    create: 'api_key:create',
    remove: 'api_key:remove',
    has: 'api_key:has',
  } as const;

  protected create(): void {
    ipcMain.handle(this._channelMap.get, this._get);
    ipcMain.handle(this._channelMap.set, this._set);
    ipcMain.handle(this._channelMap.clear, this._clear);
    ipcMain.handle(this._channelMap.create, this._create);
    ipcMain.handle(this._channelMap.remove, this._remove);
    ipcMain.handle(this._channelMap.has, this._has);
  }

  protected destroy(): void {
    ipcMain.removeHandler(this._channelMap.get);
    ipcMain.removeHandler(this._channelMap.set);
    ipcMain.removeHandler(this._channelMap.clear);
    ipcMain.removeHandler(this._channelMap.create);
    ipcMain.removeHandler(this._channelMap.remove);
    ipcMain.removeHandler(this._channelMap.has);
  }

  private _get = (): string[] => getApiKey();
  private _set = (_ev: IpcMainInvokeEvent, apiKey: string[]): void =>
    setApiKey(apiKey);
  private _clear = (): void => clearApiKey();
  private _create = (_ev: IpcMainInvokeEvent, apiKey: string): void =>
    createApiKey(apiKey);
  private _remove = (_ev: IpcMainInvokeEvent, apiKey: string): void =>
    removeApiKey(apiKey);
  private _has = (_ev: IpcMainInvokeEvent, apiKey: string): boolean =>
    hasApiKey(apiKey);

  public handlers = {
    get: (): Promise<string[]> =>
      ipcRenderer.invoke(this._channelMap.get) as Promise<string[]>,
    set: (apiKey: string[]): Promise<void> =>
      ipcRenderer.invoke(this._channelMap.set, apiKey) as Promise<void>,
    clear: (): Promise<void> =>
      ipcRenderer.invoke(this._channelMap.clear) as Promise<void>,
    create: (apiKey: string): Promise<void> =>
      ipcRenderer.invoke(this._channelMap.create, apiKey) as Promise<void>,
    remove: (apiKey: string): Promise<void> =>
      ipcRenderer.invoke(this._channelMap.remove, apiKey) as Promise<void>,
    has: (apiKey: string): Promise<boolean> =>
      ipcRenderer.invoke(this._channelMap.has, apiKey) as Promise<boolean>,
  };
}

export const apiKeyChannel = new ApiKeyChannel();
