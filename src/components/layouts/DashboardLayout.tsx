import { useHeadMeta } from '@/hooks';
import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PropsWithChildren, ReactElement, useMemo, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useDebounceCallback, useLocalStorage } from 'usehooks-ts';
import {
  AppDrawer,
  DashboardNavDrawer,
  DashboardProvider,
  UserDrawer,
} from '../dashboard';
import { Main } from './Main';

const navDrawerWidth = 48;

export const DashboardLayout = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  const { t: tMeta } = useTranslation('meta');
  const { title, description } = useHeadMeta('Dashboard');
  const router = useRouter();
  const openAppListDrawer = useMemo(
    () => router.pathname.startsWith('/dashboard/app'),
    [router.pathname],
  );
  const openUserListDrawer = useMemo(
    () => router.pathname.startsWith('/dashboard/user'),
    [router.pathname],
  );
  const openDrawer = useMemo(
    () => openAppListDrawer || openUserListDrawer,
    [openAppListDrawer, openUserListDrawer],
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
          variant="permanent"
          ModalProps={{ keepMounted: true }}
          sx={{
            width: navDrawerWidth + 1,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              zIndex: (theme) => theme.zIndex.drawer + 10,
              width: navDrawerWidth + 1,
              boxSizing: 'border-box',
            },
          }}
        />
        <AppDrawer
          open={openAppListDrawer}
          variant="persistent"
          ModalProps={{ keepMounted: true }}
          sx={{
            width: listDrawerWidth + 1,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: listDrawerWidth + 1,
              boxSizing: 'border-box',
              left: navDrawerWidth + 1,
            },
          }}
          transitionDuration={0}
        />
        <UserDrawer
          open={openUserListDrawer}
          variant="persistent"
          ModalProps={{ keepMounted: true }}
          sx={{
            width: listDrawerWidth + 1,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: listDrawerWidth + 1,
              boxSizing: 'border-box',
              left: navDrawerWidth + 1,
            },
          }}
          transitionDuration={0}
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
