import { ipcRenderer } from 'electron';
import { channelMap } from './map';

export const apiKeyChannelRenderer = {
  get: (): Promise<string[]> =>
    ipcRenderer.invoke(channelMap.get) as Promise<string[]>,
  set: (apiKey: string[]): Promise<void> =>
    ipcRenderer.invoke(channelMap.set, apiKey) as Promise<void>,
  clear: (): Promise<void> =>
    ipcRenderer.invoke(channelMap.clear) as Promise<void>,
  create: (apiKey: string): Promise<void> =>
    ipcRenderer.invoke(channelMap.create, apiKey) as Promise<void>,
  remove: (apiKey: string): Promise<void> =>
    ipcRenderer.invoke(channelMap.remove, apiKey) as Promise<void>,
  has: (apiKey: string): Promise<boolean> =>
    ipcRenderer.invoke(channelMap.has, apiKey) as Promise<boolean>,
  getActive: (): Promise<string | null> =>
    ipcRenderer.invoke(channelMap.getActive) as Promise<string | null>,
  setActive: (apiKey: string): Promise<void> =>
    ipcRenderer.invoke(channelMap.setActive, apiKey) as Promise<void>,
};
