import { ipcRenderer, type Rectangle } from 'electron';
import { channelMap } from './map';

export const commonChannelRenderer = {
  getAppVersion: (): Promise<string> =>
    ipcRenderer.invoke(channelMap.getAppVersion) as Promise<string>,
  getWindowBound: (): Promise<Rectangle | undefined> =>
    ipcRenderer.invoke(channelMap.getWindowBound) as Promise<
      Rectangle | undefined
    >,
};
