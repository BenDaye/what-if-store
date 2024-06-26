import { app, BrowserWindow } from 'electron';
import { default as waitPort } from 'wait-port';
import { bridgeBootstrap } from '@what-if-store/bridge';
import { initializeIpc } from './ipc';
import { initializeLogger } from './logger';
import { initializePath, initializeTray, startPowerSaveBlocker, stopPowerSaveBlocker } from './utils';
import { initializeWindow } from './window';

const bootstrap = async () => {
  initializePath();
  initializeLogger();
  initializeIpc();

  bridgeBootstrap.start();
  await waitPort({ port: bridgeBootstrap.port, timeout: 30 * 1000 });

  initializeTray();
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
    await bridgeBootstrap.stop();
    stopPowerSaveBlocker();
  });
});
