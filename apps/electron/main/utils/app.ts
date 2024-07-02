import { app } from 'electron';

export const isDev = process.env.NODE_ENV !== 'production';

export const appName = `${isDev ? '[Dev] ' : ''}${app.getName()}`;
export const appTitle = `${appName} ${app.getVersion()}`;
