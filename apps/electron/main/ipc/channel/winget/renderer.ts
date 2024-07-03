import { ipcRenderer } from 'electron';
import type { WingetListItem } from '@what-if-store/types/winget';
import type {
  WingetCommonArgs,
  WingetConfigureArgs,
  WingetDownloadArgs,
  WingetExportArgs,
  WingetFeaturesArgs,
  WingetHashArgs,
  WingetImportArgs,
  WingetInstallArgs,
  WingetListArgs,
  Output as WingetOutput,
  WingetSearchArgs,
  WingetSettingsArgs,
  WingetShowArgs,
  WingetUninstallArgs,
  WingetUpgradeArgs,
  WingetValidateArgs,
} from '@what-if-store/utils/winget';
import { channelMap } from './map';
import type { WingetChannelResult } from './types';

export const wingetChannelRenderer = {
  // Original: Always return WingetOutput
  configure: (args: WingetConfigureArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.configure, args) as Promise<WingetOutput>,
  download: (args: WingetDownloadArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.download, args) as Promise<WingetOutput>,
  export: (args: WingetExportArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.export, args) as Promise<WingetOutput>,
  features: (args: WingetFeaturesArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.features, args) as Promise<WingetOutput>,
  hash: (args: WingetHashArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.hash, args) as Promise<WingetOutput>,
  import: (args: WingetImportArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.import, args) as Promise<WingetOutput>,
  install: (args: WingetInstallArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.install, args) as Promise<WingetOutput>,
  add: (args: WingetInstallArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.add, args) as Promise<WingetOutput>,
  list: (args: WingetListArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.list, args) as Promise<WingetOutput>,
  ls: (args: WingetListArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.ls, args) as Promise<WingetOutput>,
  pin: (args: WingetCommonArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.pin, args) as Promise<WingetOutput>,
  search: (args: WingetSearchArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.search, args) as Promise<WingetOutput>,
  find: (args: WingetSearchArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.find, args) as Promise<WingetOutput>,
  settings: (args: WingetSettingsArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.settings, args) as Promise<WingetOutput>,
  config: (args: WingetSettingsArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.config, args) as Promise<WingetOutput>,
  show: (args: WingetShowArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.show, args) as Promise<WingetOutput>,
  view: (args: WingetShowArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.view, args) as Promise<WingetOutput>,
  source: (args: WingetCommonArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.source, args) as Promise<WingetOutput>,
  uninstall: (args: WingetUninstallArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.uninstall, args) as Promise<WingetOutput>,
  remove: (args: WingetUninstallArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.remove, args) as Promise<WingetOutput>,
  rm: (args: WingetUninstallArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.rm, args) as Promise<WingetOutput>,
  upgrade: (args: WingetUpgradeArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.upgrade, args) as Promise<WingetOutput>,
  update: (args: WingetUpgradeArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.update, args) as Promise<WingetOutput>,
  validate: (args: WingetValidateArgs): Promise<WingetOutput> =>
    ipcRenderer.invoke(channelMap.validate, args) as Promise<WingetOutput>,
  // Shortcuts: Always return WingetChannelResult
  version: (args: never) =>
    ipcRenderer.invoke(channelMap.version, args) as Promise<WingetChannelResult<string>>,
  formattedList: (args: WingetListArgs): Promise<WingetChannelResult<WingetListItem[]>> =>
    ipcRenderer.invoke(channelMap.formattedList, args) as Promise<WingetChannelResult<WingetListItem[]>>,
  formattedUpgradableList: (args: WingetListArgs): Promise<WingetChannelResult<WingetListItem[]>> =>
    ipcRenderer.invoke(channelMap.formattedUpgradableList, args) as Promise<
      WingetChannelResult<WingetListItem[]>
    >,
};
