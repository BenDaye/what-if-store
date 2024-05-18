import { Schema, default as Store } from 'electron-store';
import { getPath } from '../utils';

export type SchemaType = string[];

const schema: Schema<SchemaType> = [];

export const store = new Store<SchemaType>({
  schema,
  name: 'api_key',
  cwd: getPath('userData'),
});

export const getApiKey = (): string[] => store.store;
export const setApiKey = (apiKey: string[]): void => store.set(apiKey);
export const clearApiKey = (): void => store.clear();
export const createApiKey = (apiKey: string): void => {
  const apiKeys = getApiKey();
  if (!apiKeys.includes(apiKey)) {
    apiKeys.push(apiKey);
    setApiKey(apiKeys);
  }
};
export const removeApiKey = (apiKey: string): void => {
  const apiKeys = getApiKey();
  const index = apiKeys.indexOf(apiKey);
  if (index !== -1) {
    apiKeys.splice(index, 1);
    setApiKey(apiKeys);
  }
};
export const hasApiKey = (apiKey: string): boolean =>
  getApiKey().includes(apiKey);
