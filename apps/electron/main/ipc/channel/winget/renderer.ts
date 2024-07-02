import { ipcRenderer } from 'electron';
import type { WingetListItem } from '@what-if-store/types/winget';
import { channelMap } from './map';

export const wingetChannelRenderer = {
  commandAvailable: (): Promise<boolean> =>
    ipcRenderer.invoke(channelMap.commandAvailable) as Promise<boolean>,
  getList: (): Promise<WingetListItem[] | string> =>
    ipcRenderer.invoke(channelMap.getList) as Promise<WingetListItem[] | string>,
  getUpgradeList: (): Promise<WingetListItem[] | string> =>
    ipcRenderer.invoke(channelMap.getUpgradeList) as Promise<WingetListItem[] | string>,
};
