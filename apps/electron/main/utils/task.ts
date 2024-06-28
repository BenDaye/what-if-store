import { getInstalledApps } from 'get-installed-apps';
import { setInstalledApps } from '../store/application';

export const overrideInstalledApps = async () => {
  const apps = await getInstalledApps();
  setInstalledApps(apps);
};

export const startup = async () => {
  await Promise.allSettled([overrideInstalledApps()])
    .then((results) => {
      results.forEach((result) => {
        if (result.status === 'rejected') console.error(result.reason);
      });
      console.log('Startup tasks completed');
    })
    .catch((error) => console.error(error));
};
