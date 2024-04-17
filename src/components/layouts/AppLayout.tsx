import {
  APP_PRIMARY_DRAWER_WIDTH,
  APP_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
  APP_SECONDARY_DRAWER_WIDTH,
  APP_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
} from '@/constants/drawer';
import { useHeadMeta } from '@/hooks';
import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { PropsWithChildren, ReactElement, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { AppNavDrawer, AppProvider } from '../app';
import { Main } from './Main';

type AppLayoutProps = PropsWithChildren<{
  hasSecondaryDrawer?: boolean;
}>;
export const AppLayout = ({
  hasSecondaryDrawer = false,
  children,
}: AppLayoutProps): ReactElement<AppLayoutProps> => {
  const { t } = useTranslation();
  const { title, description } = useHeadMeta('App');
  const [primaryDrawerWidth] = useLocalStorage<number>(
    APP_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
    APP_PRIMARY_DRAWER_WIDTH,
    {
      initializeWithValue: false,
    },
  );
  const [secondaryDrawerWidth] = useLocalStorage<number>(
    APP_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
    APP_SECONDARY_DRAWER_WIDTH,
    {
      initializeWithValue: false,
    },
  );

  const mainLeft = useMemo(
    () => primaryDrawerWidth + (hasSecondaryDrawer ? secondaryDrawerWidth : 0),
    [primaryDrawerWidth, hasSecondaryDrawer, secondaryDrawerWidth],
  );
  const mainWidth = useMemo(
    () =>
      `calc(100% - ${primaryDrawerWidth + (hasSecondaryDrawer ? secondaryDrawerWidth : 0)}px)`,
    [primaryDrawerWidth, hasSecondaryDrawer, secondaryDrawerWidth],
  );
  return (
    <AppProvider>
      <Head key="app">
        <title>{t('meta:App.Title', title ?? 'App Title')}</title>
        <meta
          name="description"
          content={t('meta:App.Description', description ?? 'App Description')}
        />
      </Head>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <AppNavDrawer />

        <Main
          open={false}
          right={240}
          sx={{
            position: 'fixed',
            top: 0,
            left: mainLeft,
            overflow: 'hidden',
            height: 1,
            width: mainWidth,
          }}
        >
          {children}
        </Main>
      </Box>
    </AppProvider>
  );
};
