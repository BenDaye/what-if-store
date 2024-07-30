import { ipcMain, type IpcMainInvokeEvent } from 'electron';
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
import {
  transformWingetListStdoutToItems,
  wingetAdd,
  wingetConfig,
  wingetConfigure,
  wingetDownload,
  wingetExport,
  wingetFeatures,
  wingetFind,
  wingetHash,
  wingetImport,
  wingetInstall,
  wingetList,
  wingetLs,
  wingetPin,
  wingetRemove,
  wingetRm,
  wingetSearch,
  wingetSettings,
  wingetShow,
  wingetSource,
  wingetUninstall,
  wingetUpdate,
  wingetUpgrade,
  wingetValidate,
  wingetVersion,
  wingetView,
} from '@what-if-store/utils/winget';
import { transformErrorToString } from '../../../utils/error';
import { IpcChannel } from '../types';
import { channelMap } from './map';
import type { WingetChannelResult } from './types';

const DEFAULT_ARGS = {
  '--disable-interactivity': true,
  '--ignore-warnings': true,
} as const;

class WingetChannel extends IpcChannel {
  protected create(): void {
    // Original: Always return WingetOutput
    ipcMain.handle(channelMap.configure, this._configure);
    ipcMain.handle(channelMap.download, this._download);
    ipcMain.handle(channelMap.export, this._export);
    ipcMain.handle(channelMap.features, this._features);
    ipcMain.handle(channelMap.hash, this._hash);
    ipcMain.handle(channelMap.import, this._import);
    ipcMain.handle(channelMap.install, this._install);
    ipcMain.handle(channelMap.add, this._add);
    ipcMain.handle(channelMap.list, this._list);
    ipcMain.handle(channelMap.ls, this._ls);
    ipcMain.handle(channelMap.pin, this._pin);
    ipcMain.handle(channelMap.search, this._search);
    ipcMain.handle(channelMap.find, this._find);
    ipcMain.handle(channelMap.settings, this._settings);
    ipcMain.handle(channelMap.config, this._config);
    ipcMain.handle(channelMap.show, this._show);
    ipcMain.handle(channelMap.view, this._view);
    ipcMain.handle(channelMap.source, this._source);
    ipcMain.handle(channelMap.uninstall, this._uninstall);
    ipcMain.handle(channelMap.remove, this._remove);
    ipcMain.handle(channelMap.rm, this._rm);
    ipcMain.handle(channelMap.upgrade, this._upgrade);
    ipcMain.handle(channelMap.update, this._update);
    ipcMain.handle(channelMap.validate, this._validate);
    // Shortcuts: Always return WingetChannelResult
    ipcMain.handle(channelMap.version, this._version);
    ipcMain.handle(channelMap.formattedList, this._formattedList);
    ipcMain.handle(channelMap.formattedUpgradableList, this._formattedUpgradableList);
  }

  protected destroy(): void {
    // Original
    ipcMain.removeHandler(channelMap.configure);
    ipcMain.removeHandler(channelMap.download);
    ipcMain.removeHandler(channelMap.export);
    ipcMain.removeHandler(channelMap.features);
    ipcMain.removeHandler(channelMap.hash);
    ipcMain.removeHandler(channelMap.import);
    ipcMain.removeHandler(channelMap.install);
    ipcMain.removeHandler(channelMap.add);
    ipcMain.removeHandler(channelMap.list);
    ipcMain.removeHandler(channelMap.ls);
    ipcMain.removeHandler(channelMap.pin);
    ipcMain.removeHandler(channelMap.search);
    ipcMain.removeHandler(channelMap.find);
    ipcMain.removeHandler(channelMap.settings);
    ipcMain.removeHandler(channelMap.config);
    ipcMain.removeHandler(channelMap.show);
    ipcMain.removeHandler(channelMap.view);
    ipcMain.removeHandler(channelMap.source);
    ipcMain.removeHandler(channelMap.uninstall);
    ipcMain.removeHandler(channelMap.remove);
    ipcMain.removeHandler(channelMap.rm);
    ipcMain.removeHandler(channelMap.upgrade);
    ipcMain.removeHandler(channelMap.update);
    ipcMain.removeHandler(channelMap.validate);
    // Shortcuts
    ipcMain.removeHandler(channelMap.version);
    ipcMain.removeHandler(channelMap.formattedList);
    ipcMain.removeHandler(channelMap.formattedUpgradableList);
  }

  private _configure = async (
    _ev: IpcMainInvokeEvent,
    args: WingetConfigureArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetConfigure(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _download = async (
    _ev: IpcMainInvokeEvent,
    args: WingetDownloadArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetDownload(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _export = async (
    _ev: IpcMainInvokeEvent,
    args: WingetExportArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetExport(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _features = async (
    _ev: IpcMainInvokeEvent,
    args: WingetFeaturesArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetFeatures(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _hash = async (
    _ev: IpcMainInvokeEvent,
    args: WingetHashArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetHash(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _import = async (
    _ev: IpcMainInvokeEvent,
    args: WingetImportArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetImport(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _install = async (
    _ev: IpcMainInvokeEvent,
    args: WingetInstallArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetInstall(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _add = async (
    _ev: IpcMainInvokeEvent,
    args: WingetInstallArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetAdd(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _list = async (
    _ev: IpcMainInvokeEvent,
    args: WingetListArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetList(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _ls = async (
    _ev: IpcMainInvokeEvent,
    args: WingetListArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetLs(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _pin = async (
    _ev: IpcMainInvokeEvent,
    args: WingetCommonArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetPin(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _search = async (
    _ev: IpcMainInvokeEvent,
    args: WingetSearchArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetSearch(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _find = async (
    _ev: IpcMainInvokeEvent,
    args: WingetSearchArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetFind(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _settings = async (
    _ev: IpcMainInvokeEvent,
    args: WingetSettingsArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetSettings(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _config = async (
    _ev: IpcMainInvokeEvent,
    args: WingetSettingsArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetConfig(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _show = async (
    _ev: IpcMainInvokeEvent,
    args: WingetShowArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetShow(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _view = async (
    _ev: IpcMainInvokeEvent,
    args: WingetShowArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetView(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _source = async (
    _ev: IpcMainInvokeEvent,
    args: WingetCommonArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetSource(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _uninstall = async (
    _ev: IpcMainInvokeEvent,
    args: WingetUninstallArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetUninstall(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _remove = async (
    _ev: IpcMainInvokeEvent,
    args: WingetUninstallArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetRemove(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _rm = async (
    _ev: IpcMainInvokeEvent,
    args: WingetUninstallArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetRm(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _upgrade = async (
    _ev: IpcMainInvokeEvent,
    args: WingetUpgradeArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetUpgrade(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _update = async (
    _ev: IpcMainInvokeEvent,
    args: WingetUpgradeArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetUpdate(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _validate = async (
    _ev: IpcMainInvokeEvent,
    args: WingetValidateArgs = DEFAULT_ARGS,
  ): Promise<WingetOutput> => {
    try {
      return await wingetValidate(args);
    } catch (error) {
      return { error: transformErrorToString(error) };
    }
  };

  private _version = async (): Promise<WingetChannelResult<string>> => {
    try {
      return transformWingetResultToChannelResult(await wingetVersion(), transformWingetStdoutToString);
    } catch (error) {
      return { success: false, error: transformErrorToString(error) };
    }
  };

  private _formattedList = async (
    _ev: IpcMainInvokeEvent,
    args: WingetListArgs = DEFAULT_ARGS,
  ): Promise<WingetChannelResult<WingetListItem[]>> => {
    try {
      return transformWingetResultToChannelResult(await wingetList(args), transformWingetListStdoutToItems);
    } catch (error) {
      return { success: false, error: transformErrorToString(error) };
    }
  };

  private _formattedUpgradableList = async (
    _ev: IpcMainInvokeEvent,
    args: WingetListArgs = {
      '--disable-interactivity': true,
      '--ignore-warnings': true,
      '--upgrade-available': true,
    },
  ): Promise<WingetChannelResult<WingetListItem[]>> => {
    try {
      return transformWingetResultToChannelResult(await wingetList(args), transformWingetListStdoutToItems);
    } catch (error) {
      return { success: false, error: transformErrorToString(error) };
    }
  };
}

export const wingetChannelMain = new WingetChannel();

const transformWingetStdoutToString = (stdout: string): string => stdout.trim();

const transformWingetResultToChannelResult = <T = string>(
  output: WingetOutput,
  formatter: (stdout: WingetOutput['stdout']) => T,
): WingetChannelResult<T> => {
  if (output.error) {
    return { success: false, error: output.error };
  }
  if (output.stderr) {
    return { success: false, error: output.stderr };
  }
  if (!output.stdout) {
    return { success: false, error: 'No stdout available' };
  }
  try {
    return { success: true, result: formatter(output.stdout) };
  } catch (e) {
    return { success: false, error: e.message || 'Formatter error' };
  }
};
