import { apiKey, application, common } from './channel';

export const initializeIpc = () => {
  common.initialize();
  apiKey.initialize();
  application.initialize();
};
