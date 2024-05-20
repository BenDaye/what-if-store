import { app, BrowserWindow } from 'electron';
import serve from 'electron-serve';
import { initializeIpc } from './ipc';
import { initializeLogger } from './logger';
import {
  initializePath,
  startPowerSaveBlocker,
  stopPowerSaveBlocker,
} from './utils';
import { createWindow } from './window';

const isDev = process.env.NODE_ENV !== 'production';

const main = async () => {
  initializePath();
  initializeLogger();

  const mainWindow = createWindow({
    center: true,
    webPreferences: {
      webSecurity: false,
    },
  });

  mainWindow.removeMenu();
  // if (mainWindow.maximizable) mainWindow.maximize();

  initializeIpc(mainWindow);

  if (isDev) {
    const rendererPort = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${rendererPort}`);
    mainWindow.webContents.openDevTools({ mode: 'undocked' });
  } else {
    serve({ directory: 'app' });
    await mainWindow.loadURL('app://./index.html');
  }

  startPowerSaveBlocker();
};

app.whenReady().then(async () => {
  await main();
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await main();
    }
  });
  app.on('before-quit', () => {
    stopPowerSaveBlocker();
  });
});
