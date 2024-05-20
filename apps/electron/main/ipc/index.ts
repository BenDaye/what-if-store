import { apiKey, common } from './channel';

export const initializeIpc = () => {
  common.initialize();
  apiKey.initialize();
};
