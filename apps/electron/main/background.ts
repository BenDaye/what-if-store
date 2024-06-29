import { app, BrowserWindow } from 'electron';
import { default as waitPort } from 'wait-port';
import { bridgeBootstrap } from '@what-if-store/bridge';
import { initializeIpc } from './ipc';
import { initializeLogger } from './logger';
import {
  initializePath,
  initializeTray,
  shutdownTask,
  startPowerSaveBlocker,
  startupTask,
  stopPowerSaveBlocker,
} from './utils';
import { initializeWindow } from './window';

const bootstrap = async () => {
  initializePath();
  initializeLogger();
  initializeIpc();

  bridgeBootstrap.start();
  await waitPort({ port: bridgeBootstrap.port, timeout: 30 * 1000 });

  initializeTray();

  await startupTask();
};

app.whenReady().then(async () => {
  await bootstrap();
  startPowerSaveBlocker();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await initializeWindow();
    }
  });
  app.on('before-quit', async () => {
    await shutdownTask();
    await bridgeBootstrap.stop();
    stopPowerSaveBlocker();
  });
});
