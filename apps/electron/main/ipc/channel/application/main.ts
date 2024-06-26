import { ipcMain } from 'electron';
import { getInstalledApps } from 'get-installed-apps';
import { IpcChannel } from '../types';
import { channelMap } from './map';

class ApplicationChannel extends IpcChannel {
  protected create(): void {
    ipcMain.handle(channelMap.getInstalledApplications, async () => await getInstalledApps());
  }

  protected destroy(): void {
    ipcMain.removeHandler(channelMap.getInstalledApplications);
  }
}

export const applicationChannelMain = new ApplicationChannel();
