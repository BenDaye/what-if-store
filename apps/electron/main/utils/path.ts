import path from 'path';
import { App, app } from 'electron';
import isDev from 'electron-is-dev';
import { ensureDirSync } from 'fs-extra';

const appName = isDev ? `${app.getName()} (DEV)` : app.getName();

export const initializePath = () => {
  app.setName(appName);

  const appDataPath = path.join(app.getPath('home'), '.config');
  ensureDirSync(appDataPath, 0o2775);
  app.setPath('appData', appDataPath);

  const userDataPath = path.join(appDataPath, appName);
  ensureDirSync(userDataPath, 0o2775);
  app.setPath('userData', userDataPath);

  const sessionDataPath = path.join(userDataPath, 'session');
  ensureDirSync(sessionDataPath, 0o2775);
  app.setPath('session', sessionDataPath);

  const logsPath = path.join(userDataPath, 'logs');
  ensureDirSync(logsPath, 0o2775);
  app.setPath('logs', logsPath);
  app.setAppLogsPath(logsPath);
};

export const getPath = (name: Parameters<App['getPath']>[0]) => {
  initializePath();

  return app.getPath(name);
};
