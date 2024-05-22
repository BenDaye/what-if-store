import type { PropsWithChildren } from 'react';
import { createContext, useState } from 'react';
import { useIsClient } from 'usehooks-ts';

export type ApiKeyProviderProps = PropsWithChildren;

export type ApiKeyContextValue = {
  keys: string[];
  get: () => Promise<string[]>;
  set: (keys: string[]) => Promise<void>;
  clear: () => Promise<void>;
  create: (key: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
  has: (key: string) => Promise<boolean>;
};

export const ApiKeyContext = createContext?.<ApiKeyContextValue | undefined>(undefined);

export const ApiKeyProvider = ({ children }: ApiKeyProviderProps) => {
  if (!ApiKeyContext) throw new Error('ApiKeyProvider must be used within a ApiKeyContext.Provider');

  const isClient = useIsClient();
  const [keys, setKeys] = useState<string[]>([]);

  const value: ApiKeyContextValue = {
    keys,
    get: async () => {
      if (!isClient) return [];
      const keys = await window.ipc.apiKey.get();
      setKeys(keys);
      return keys;
    },
    set: async (keys) => {
      if (!isClient) return;
      await window.ipc.apiKey.set(keys);
      await value.get();
    },
    clear: async () => {
      if (!isClient) return;
      await window.ipc.apiKey.clear();
      await value.get();
    },
    create: async (key) => {
      if (!isClient) return;
      await window.ipc.apiKey.create(key);
      await value.get();
    },
    remove: async (key) => {
      if (!isClient) return;
      await window.ipc.apiKey.remove(key);
      await value.get();
    },
    has: async (key) => {
      if (!isClient) return false;
      return await window.ipc.apiKey.has(key);
    },
  };

  return <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>;
};
