import { Schema, default as Store } from 'electron-store';
import { getPath } from '../utils';

export interface ApiKey {
  key: string;
  active: boolean;
}

export type SchemaType = {
  keys: ApiKey[];
};

const schema: Schema<SchemaType> = {
  keys: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
        },
        active: {
          type: 'boolean',
          default: false,
        },
      },
      required: ['key', 'active'],
    },
  },
};

export const store = new Store<SchemaType>({
  schema,
  name: 'api_key',
  cwd: getPath('userData'),
});

export const getApiKeys = (): ApiKey[] => store.get('keys');
export const setApiKeys = (keys: ApiKey[]): void => store.set('keys', keys);
export const clearApiKey = (): void => store.clear();
export const createApiKey = (key: string): void => {
  const keys = getApiKeys();
  if (keys.findIndex((item) => item.key === key) === -1) {
    keys.push({ key, active: false });
    setApiKeys(keys);
  }
};
export const removeApiKey = (key: string): void => {
  const keys = getApiKeys();
  const index = keys.findIndex((item) => item.key === key);
  if (index !== -1) {
    keys.splice(index, 1);
    setApiKeys(keys);
  }
};
export const hasApiKey = (apiKey: string): boolean =>
  getApiKeys().some((item) => item.key === apiKey);
export const setActiveApiKey = (key: string): void => {
  const keys = getApiKeys();
  const index = keys.findIndex((item) => item.key === key);
  if (index !== -1) {
    keys.forEach((item) => (item.active = false));
    keys[index].active = true;
    setApiKeys(keys);
  }
};
export const getActiveApiKey = (): string | null => {
  const keys = getApiKeys();
  const key = keys.find((item) => item.active);
  return key ? key.key : null;
};
