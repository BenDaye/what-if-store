import { ipcMain, IpcMainInvokeEvent } from 'electron';
import {
  ApiKey,
  clearApiKey,
  createApiKey,
  getActiveApiKey,
  getApiKeys,
  hasApiKey,
  removeApiKey,
  setActiveApiKey,
  setApiKeys,
} from '../../../store';
import { IpcChannel } from '../types';
import { channelMap } from './map';

class Channel extends IpcChannel {
  protected create(): void {
    ipcMain.handle(channelMap.get, this._get);
    ipcMain.handle(channelMap.set, this._set);
    ipcMain.handle(channelMap.clear, this._clear);
    ipcMain.handle(channelMap.create, this._create);
    ipcMain.handle(channelMap.remove, this._remove);
    ipcMain.handle(channelMap.has, this._has);
    ipcMain.handle(channelMap.getActive, this._getActive);
    ipcMain.handle(channelMap.setActive, this._setActive);
  }

  protected destroy(): void {
    ipcMain.removeHandler(channelMap.get);
    ipcMain.removeHandler(channelMap.set);
    ipcMain.removeHandler(channelMap.clear);
    ipcMain.removeHandler(channelMap.create);
    ipcMain.removeHandler(channelMap.remove);
    ipcMain.removeHandler(channelMap.has);
    ipcMain.removeHandler(channelMap.getActive);
    ipcMain.removeHandler(channelMap.setActive);
  }

  private _get = (): string[] => getApiKeys().map((item) => item.key);
  private _set = (_ev: IpcMainInvokeEvent, apiKey: ApiKey[]): void =>
    setApiKeys(apiKey);
  private _clear = (): void => clearApiKey();
  private _create = (_ev: IpcMainInvokeEvent, apiKey: string): void =>
    createApiKey(apiKey);
  private _remove = (_ev: IpcMainInvokeEvent, apiKey: string): void =>
    removeApiKey(apiKey);
  private _has = (_ev: IpcMainInvokeEvent, apiKey: string): boolean =>
    hasApiKey(apiKey);
  private _getActive = (): string | null => getActiveApiKey();
  private _setActive = (_ev: IpcMainInvokeEvent, apiKey: string) =>
    setActiveApiKey(apiKey);
}

export const apiKeyChannelMain = new Channel();
