import { useEffect, useState } from 'react';
import { trpc } from '@what-if-store/server/react/trpc';

type HeadMetaType = 'Default' | 'App' | 'Dashboard';
interface HeadMeta {
  title: string;
  description: string;
}
export const useHeadMeta = (type: HeadMetaType = 'Default'): HeadMeta => {
  const initMeta = (): HeadMeta => {
    switch (type) {
      case 'App':
        return {
          title: 'App Title',
          description: 'App Description',
        };
      case 'Dashboard':
        return {
          title: 'Dashboard Title',
          description: 'Dashboard Description',
        };
      default:
        return {
          title: 'Default Title',
          description: 'Default Description',
        };
    }
  };
  const [{ title, description }, setMeta] = useState(initMeta);

  const { data: appMeta, isFetched: isFetchedAppMeta } = trpc.publicAppMeta.get.useQuery(undefined, {
    enabled: type === 'App',
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (isFetchedAppMeta && appMeta) setMeta(appMeta);
  }, [appMeta, isFetchedAppMeta]);

  const { data: dashboardMeta, isFetched: isFetchedDashboardMeta } = trpc.publicDashboardMeta.get.useQuery(
    undefined,
    {
      enabled: type === 'Dashboard',
      refetchOnWindowFocus: true,
    },
  );

  useEffect(() => {
    if (isFetchedDashboardMeta && dashboardMeta) setMeta(dashboardMeta);
  }, [dashboardMeta, isFetchedDashboardMeta]);

  return {
    title,
    description,
  };
};
