import { ipcRenderer } from 'electron';
import type { MacApp, WinApp } from 'get-installed-apps';
import { channelMap } from './map';

export const applicationChannelRenderer = {
  getInstalledApplications: (): Promise<MacApp[] | WinApp[]> =>
    ipcRenderer.invoke(channelMap.getInstalledApplications) as Promise<MacApp[] | WinApp[]>,
};
