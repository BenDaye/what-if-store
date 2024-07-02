import { exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { ipcMain } from 'electron';
import type { WingetListItem } from '@what-if-store/types/winget';
import { IpcChannel } from '../types';
import { channelMap } from './map';

const exec = promisify(execCallback);

const formatList = (stdout: string): WingetListItem[] => {
  const lines = stdout.split('\n').filter((line) => line.trim() !== '');
  // 移除标题行
  lines.shift();
  // 将每一行转换为对象
  return lines.map((line) => {
    const [name, id, version, available, source] = line.split(/\s{2,}/).map((item) => item.trim());
    return { name, id, version, available, source };
  });
};

class WingetChannel extends IpcChannel {
  protected create(): void {
    ipcMain.handle(channelMap.commandAvailable, this._commandAvailable);
    ipcMain.handle(channelMap.getList, this._getList);
    ipcMain.handle(channelMap.getUpgradeList, this._getUpgradeList);
  }

  protected destroy(): void {
    ipcMain.removeHandler(channelMap.commandAvailable);
    ipcMain.removeHandler(channelMap.getList);
    ipcMain.removeHandler(channelMap.getUpgradeList);
  }

  private _commandAvailable = async (): Promise<boolean> => {
    try {
      const { stdout, stderr } = await exec('winget --version');
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return false;
      }
      console.log(`Stdout: ${stdout}`);
      return true;
    } catch (error) {
      console.error(`Exec error: ${error}`);
      return false;
    }
  };

  private _getList = async (): Promise<WingetListItem[] | string> => {
    try {
      const { stdout, stderr } = await exec('winget list');
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return stderr;
      }
      console.log(`Stdout: ${stdout}`);
      return formatList(stdout);
    } catch (error) {
      console.error(`Exec error: ${error}`);
      return error instanceof Error ? error.message : 'Unknown error';
    }
  };

  private _getUpgradeList = async (): Promise<WingetListItem[] | string> => {
    try {
      const { stdout, stderr } = await exec('winget list --upgrade-available');
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return stderr;
      }
      console.log(`Stdout: ${stdout}`);
      return formatList(stdout);
    } catch (error) {
      console.error(`Exec error: ${error}`);
      return error instanceof Error ? error.message : 'Unknown error';
    }
  };
}

export const wingetChannelMain = new WingetChannel();
