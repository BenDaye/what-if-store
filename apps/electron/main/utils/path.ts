import path from 'path';
import type { App } from 'electron';
import { app } from 'electron';
import { ensureDirSync } from 'fs-extra';

export const initializePath = () => {
  const isDev = process.env.NODE_ENV !== 'production';
  const appName = isDev ? `${app.getName()} (Dev)` : app.getName();

  const appDataPath = path.join(app.getPath('home'), '.config');
  ensureDirSync(appDataPath, 0o2775);
  app.setPath('appData', appDataPath);

  const userDataPath = path.join(appDataPath, appName);
  ensureDirSync(userDataPath, 0o2775);
  app.setPath('userData', userDataPath);

  const sessionDataPath = path.join(userDataPath, 'sessionData');
  ensureDirSync(sessionDataPath, 0o2775);
  app.setPath('sessionData', sessionDataPath);

  const logsPath = path.join(userDataPath, 'logs');
  ensureDirSync(logsPath, 0o2775);
  app.setPath('logs', logsPath);
};

export const getPath = (name: Parameters<App['getPath']>[0]) => {
  initializePath();

  return app.getPath(name);
};
