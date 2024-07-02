import { apiKey, application, common, winget } from './channel';

export const initializeIpc = () => {
  common.initialize();
  apiKey.initialize();
  application.initialize();
  winget.initialize();
};
