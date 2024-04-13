import { useHeadMeta } from '@/hooks';
import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PropsWithChildren, ReactElement, useMemo, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useDebounceCallback, useLocalStorage } from 'usehooks-ts';
import {
  ApplicationDrawer,
  DashboardNavDrawer,
  DashboardProvider,
  UserDrawer,
} from '../dashboard';
import { ProviderDrawer } from '../dashboard/provider';
import { Main } from './Main';

const navDrawerWidth = 48;

export const DashboardLayout = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  const { t: tMeta } = useTranslation('meta');
  const { title, description } = useHeadMeta('Dashboard');
  const { pathname } = useRouter();
  const openApplicationListDrawer = useMemo(
    () => pathname.startsWith('/dashboard/app'),
    [pathname],
  );
  const openUserListDrawer = useMemo(
    () => pathname.startsWith('/dashboard/user'),
    [pathname],
  );
  const openProviderListDrawer = useMemo(
    () => pathname.startsWith('/dashboard/provider'),
    [pathname],
  );
  const openDrawer = useMemo(
    () =>
      openApplicationListDrawer || openUserListDrawer || openProviderListDrawer,
    [openApplicationListDrawer, openProviderListDrawer, openUserListDrawer],
  );
  const [listDrawerWidth, setListDrawerWidth] = useLocalStorage<number>(
    'dashboard-layout-left-drawer-width',
    300,
    {
      initializeWithValue: false,
    },
  );
  const handleListDrawerWidth = useDebounceCallback(setListDrawerWidth, 10);
  const mainLeft = useMemo(
    () => navDrawerWidth + 1 + (openDrawer ? listDrawerWidth + 1 : 0),
    [listDrawerWidth, openDrawer],
  );
  const mainWidth = useMemo(
    () =>
      `calc(100% - ${navDrawerWidth + 1 + (openDrawer ? listDrawerWidth + 1 : 0)}px)`,
    [listDrawerWidth, openDrawer],
  );
  const theme = useTheme();
  const [rndZIndex, setRndZIndex] = useState<number>(10);
  return (
    <DashboardProvider>
      <Head key="dashboard">
        <title>{tMeta('Dashboard Title', title ?? 'Dashboard Title')}</title>
        <meta
          name="description"
          content={tMeta(
            'Dashboard Description',
            description ?? 'Dashboard Description',
          )}
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
        <Rnd
          style={{
            zIndex: openDrawer ? rndZIndex : 0,
            backgroundImage:
              theme.palette.mode === 'dark'
                ? `linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.05))`
                : `linear-gradient(rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.05))`,
          }}
          size={{
            height: openDrawer ? '100vh' : 0,
            width: openDrawer ? listDrawerWidth : 0,
          }}
          resizeHandleClasses={{
            right:
              theme.palette.mode === 'dark'
                ? 'resizeHandleClass darkMode'
                : 'resizeHandleClass',
          }}
          position={{ x: navDrawerWidth + 1, y: 0 }}
          maxWidth={480}
          minWidth={240}
          disableDragging
          enableResizing={{
            top: false,
            right: openDrawer,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          onResizeStart={() => setRndZIndex(theme.zIndex.drawer + 10)}
          onResize={(e, direction, ref) => {
            handleListDrawerWidth(ref.offsetWidth);
          }}
          onResizeStop={() => {
            setRndZIndex(10);
          }}
        />
        <DashboardNavDrawer
          overrides={{
            DrawerProps: {
              variant: 'permanent',
              sx: {
                width: navDrawerWidth + 1,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                  zIndex: (theme) => theme.zIndex.drawer + 10,
                  width: navDrawerWidth + 1,
                  boxSizing: 'border-box',
                },
                height: '100vh',
              },
            },
          }}
        />
        <ApplicationDrawer
          overrides={{
            DrawerProps: {
              open: openApplicationListDrawer,
              sx: {
                width: listDrawerWidth + 1,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                  width: listDrawerWidth + 1,
                  boxSizing: 'border-box',
                  left: navDrawerWidth + 1,
                },
                height: '100vh',
              },
              transitionDuration: 0,
            },
          }}
        />
        <UserDrawer
          overrides={{
            DrawerProps: {
              open: openUserListDrawer,
              sx: {
                width: listDrawerWidth + 1,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                  width: listDrawerWidth + 1,
                  boxSizing: 'border-box',
                  left: navDrawerWidth + 1,
                },
                height: '100vh',
              },
              transitionDuration: 0,
            },
          }}
        />
        <ProviderDrawer
          overrides={{
            DrawerProps: {
              open: openProviderListDrawer,
              sx: {
                width: listDrawerWidth + 1,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                  width: listDrawerWidth + 1,
                  boxSizing: 'border-box',
                  left: navDrawerWidth + 1,
                },
                height: '100vh',
              },
              transitionDuration: 0,
            },
          }}
        />

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
    </DashboardProvider>
  );
};
