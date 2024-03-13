import { useHeadMeta } from '@/hooks';
import { Box, useTheme } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PropsWithChildren, ReactElement, useMemo, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useDebounceCallback, useLocalStorage } from 'usehooks-ts';
import { AppNavDrawer, AppProvider } from '../app';
import { HelloDrawer, WorldDrawer } from '../example';
import { Main } from './Main';

export const AppLayout = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  const { t: tMeta } = useTranslation('meta');
  const { title, description } = useHeadMeta('App');
  const router = useRouter();
  const openHelloListDrawer = useMemo(
    () => router.pathname.startsWith('/app/hello'),
    [router.pathname],
  );
  const openWorldListDrawer = useMemo(
    () => router.pathname.startsWith('/app/world'),
    [router.pathname],
  );
  const isSecondaryDrawerOpened = useMemo(
    () => openHelloListDrawer || openWorldListDrawer,
    [openHelloListDrawer, openWorldListDrawer],
  );
  const [primaryDrawerWidth, setPrimaryDrawerWidth] = useLocalStorage<number>(
    'app-layout-primary-drawer-width',
    48,
    {
      initializeWithValue: false,
    },
  );
  const handlePrimaryDrawerWidth = useDebounceCallback(
    setPrimaryDrawerWidth,
    10,
  );
  const [secondaryDrawerWidth, setSecondaryDrawerWidth] =
    useLocalStorage<number>('app-layout-secondary-drawer-width', 300, {
      initializeWithValue: false,
    });
  const handleSecondaryDrawerWidth = useDebounceCallback(
    setSecondaryDrawerWidth,
    10,
  );
  const theme = useTheme();
  const [primaryRndZIndex, setPrimaryRndZIndex] = useState<number>(
    () => theme.zIndex.drawer + 8,
  );
  const [secondaryRndZIndex, setSecondaryRndZIndex] = useState<number>(10);

  const mainLeft = useMemo(
    () =>
      primaryDrawerWidth +
      1 +
      (isSecondaryDrawerOpened ? secondaryDrawerWidth + 1 : 0),
    [primaryDrawerWidth, isSecondaryDrawerOpened, secondaryDrawerWidth],
  );
  const mainWidth = useMemo(
    () =>
      `calc(100% - ${primaryDrawerWidth + 1 + (isSecondaryDrawerOpened ? secondaryDrawerWidth + 1 : 0)}px)`,
    [primaryDrawerWidth, isSecondaryDrawerOpened, secondaryDrawerWidth],
  );
  return (
    <AppProvider>
      <Head key="app">
        <title>{tMeta('App Title', title ?? 'App Title')}</title>
        <meta
          name="description"
          content={tMeta('App Description', description ?? 'App Description')}
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
            zIndex: primaryRndZIndex,
            backgroundImage:
              theme.palette.mode === 'dark'
                ? `linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.05))`
                : `linear-gradient(rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.05))`,
          }}
          size={{
            height: '100vh',
            width: primaryDrawerWidth,
          }}
          resizeHandleClasses={{
            right:
              theme.palette.mode === 'dark'
                ? 'resizeHandleClass darkMode'
                : 'resizeHandleClass',
          }}
          position={{ x: 0, y: 0 }}
          maxWidth={240}
          minWidth={48}
          disableDragging
          enableResizing={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          onResizeStart={() => setPrimaryRndZIndex(theme.zIndex.drawer + 20)}
          onResize={(e, direction, ref) => {
            handlePrimaryDrawerWidth(ref.offsetWidth);
          }}
          onResizeStop={() => {
            setPrimaryRndZIndex(theme.zIndex.drawer + 8);
          }}
        />
        <AppNavDrawer
          variant="permanent"
          ModalProps={{ keepMounted: true }}
          sx={{
            width: primaryDrawerWidth + 1,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              zIndex: (theme) => theme.zIndex.drawer + 10,
              width: primaryDrawerWidth + 1,
              boxSizing: 'border-box',
            },
          }}
        />
        <Rnd
          style={{
            zIndex: isSecondaryDrawerOpened ? secondaryRndZIndex : 0,
            backgroundImage:
              theme.palette.mode === 'dark'
                ? `linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.05))`
                : `linear-gradient(rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.05))`,
          }}
          size={{
            height: isSecondaryDrawerOpened ? '100vh' : 0,
            width: isSecondaryDrawerOpened ? secondaryDrawerWidth : 0,
          }}
          resizeHandleClasses={{
            right:
              theme.palette.mode === 'dark'
                ? 'resizeHandleClass darkMode'
                : 'resizeHandleClass',
          }}
          position={{ x: primaryDrawerWidth + 1, y: 0 }}
          maxWidth={480}
          minWidth={240}
          disableDragging
          enableResizing={{
            top: false,
            right: isSecondaryDrawerOpened,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          onResizeStart={() => setSecondaryRndZIndex(theme.zIndex.drawer + 10)}
          onResize={(e, direction, ref) => {
            handleSecondaryDrawerWidth(ref.offsetWidth);
          }}
          onResizeStop={() => {
            setSecondaryRndZIndex(10);
          }}
        />
        <HelloDrawer
          open={openHelloListDrawer}
          variant="persistent"
          ModalProps={{ keepMounted: true }}
          sx={{
            width: secondaryDrawerWidth + 1,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: secondaryDrawerWidth + 1,
              boxSizing: 'border-box',
              left: primaryDrawerWidth + 1,
            },
          }}
          transitionDuration={0}
        />

        <WorldDrawer
          open={openWorldListDrawer}
          variant="persistent"
          ModalProps={{ keepMounted: true }}
          sx={{
            width: secondaryDrawerWidth + 1,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: secondaryDrawerWidth + 1,
              boxSizing: 'border-box',
              left: primaryDrawerWidth + 1,
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
    </AppProvider>
  );
};
