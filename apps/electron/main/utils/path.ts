import path from 'path';
import { App, app } from 'electron';
import { ensureDirSync } from 'fs-extra';

const isDev = process.env.NODE_ENV !== 'production';

const appName = isDev ? `${app.getName()} (DEV)` : app.getName();

export const initializePath = () => {
  app.setName(appName);

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
