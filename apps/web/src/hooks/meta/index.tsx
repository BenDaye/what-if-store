import { trpc } from '@/utils/trpc';
import { useEffect, useState } from 'react';

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
          title: process.env.NEXT_PUBLIC_HEAD_META_APP_TITLE ?? 'App Title',
          description:
            process.env.NEXT_PUBLIC_HEAD_META_APP_DESCRIPTION ??
            'App Description',
        };
      case 'Dashboard':
        return {
          title:
            process.env.NEXT_PUBLIC_HEAD_META_DASHBOARD_TITLE ??
            'Dashboard Title',
          description:
            process.env.NEXT_PUBLIC_HEAD_META_DASHBOARD_DESCRIPTION ??
            'Dashboard Description',
        };
      default:
        return {
          title: 'Default Title',
          description: 'Default Description',
        };
    }
  };
  const [{ title, description }, setMeta] = useState(initMeta);

  const { data: appMeta, isFetched: isFetchedAppMeta } =
    trpc.publicAppMeta.get.useQuery(undefined, {
      enabled: type === 'App',
      refetchOnWindowFocus: true,
    });

  useEffect(() => {
    if (isFetchedAppMeta && appMeta) setMeta(appMeta);
  }, [appMeta, isFetchedAppMeta]);

  const { data: dashboardMeta, isFetched: isFetchedDashboardMeta } =
    trpc.publicDashboardMeta.get.useQuery(undefined, {
      enabled: type === 'Dashboard',
      refetchOnWindowFocus: true,
    });

  useEffect(() => {
    if (isFetchedDashboardMeta && dashboardMeta) setMeta(dashboardMeta);
  }, [dashboardMeta, isFetchedDashboardMeta]);

  return {
    title,
    description,
  };
};
