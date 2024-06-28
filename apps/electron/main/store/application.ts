import type { Schema } from 'electron-store';
import { default as Store } from 'electron-store';
import type { MacApp, WinApp } from 'get-installed-apps';
import { getPath } from '../utils';

export type SchemaType = {
  installedApps: MacApp[] | WinApp[];
};

const schema: Schema<SchemaType> = {
  installedApps: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        appName: {
          type: 'string',
        },
        appIdentifier: {
          type: 'string',
        },
        appInstallDate: {
          type: 'string',
          default: '-',
        },
        appVersion: {
          type: 'string',
          default: '-',
        },
      },
      additionalProperties: true,
      required: ['appName', 'appIdentifier'],
    },
  },
};

export const store = new Store<SchemaType>({
  schema,
  name: 'application',
  cwd: getPath('userData'),
});

export const getInstalledApps = (): MacApp[] | WinApp[] => store.get('installedApps');
export const setInstalledApps = (apps: MacApp[] | WinApp[]): void => store.set('installedApps', apps);
export const clearInstalledApps = (): void => store.clear();
export const getInstalledApp = (query: string): MacApp | WinApp | undefined => {
  const regex = new RegExp(query, 'i');
  return getInstalledApps().find((app) => regex.test(app.appIdentifier) || regex.test(app.appName));
};
export const hasInstalledApp = (query: string): boolean =>
  !!getInstalledApps().find((app) => app.appIdentifier === query);
