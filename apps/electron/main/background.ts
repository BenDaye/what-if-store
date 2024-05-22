import { app, BrowserWindow } from 'electron';
import serve from 'electron-serve';
import { default as waitPort } from 'wait-port';
import { startTRPCServer, stopTRPCServer } from '@what-if-store/bridge';
import { initializeIpc } from './ipc';
import { initializeLogger } from './logger';
import { initializePath, startPowerSaveBlocker, stopPowerSaveBlocker } from './utils';
import { createWindow } from './window';

const isDev = process.env.NODE_ENV !== 'production';

const main = async () => {
  initializePath();
  initializeLogger();
  initializeIpc();
  startTRPCServer({ port: 3232 });

  await waitPort({ port: 3232, timeout: 30 * 1000 });

  const mainWindow = createWindow({
    webPreferences: {
      webSecurity: false,
    },
  });

  mainWindow.removeMenu();
  // if (mainWindow.maximizable) mainWindow.maximize();

  if (isDev) {
    const rendererPort = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${rendererPort}`);
    mainWindow.webContents.openDevTools({ mode: 'undocked' });
  } else {
    serve({ directory: 'app' });
    await mainWindow.loadURL('app://./index.html');
  }
};

app.whenReady().then(async () => {
  await main();
  startPowerSaveBlocker();
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await main();
    }
  });
  app.on('before-quit', () => {
    stopPowerSaveBlocker();
    stopTRPCServer();
  });
});
