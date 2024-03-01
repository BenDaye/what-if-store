import { Box } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PropsWithChildren, ReactElement, useMemo } from 'react';
import { DashboardNavDrawer, DashboardProvider } from '../dashboard';
import { HelloDrawer, WorldDrawer } from '../example';
import { Main } from './Main';

type HeadMeta = {
  title?: string;
  description?: string;
};

const navDrawerWidth = 48;
const listDrawerWidth = 300;

export const DashboardLayout = ({
  title,
  description,
  children,
}: PropsWithChildren<HeadMeta>): ReactElement<PropsWithChildren<HeadMeta>> => {
  const { t: tMeta } = useTranslation('meta');
  const router = useRouter();
  const openHelloListDrawer = useMemo(
    () => router.pathname.startsWith('/dashboard/hello'),
    [router.pathname],
  );
  const openWorldListDrawer = useMemo(
    () => router.pathname.startsWith('/dashboard/world'),
    [router.pathname],
  );
  const openDrawer = useMemo(
    () => openHelloListDrawer || openWorldListDrawer,
    [openHelloListDrawer, openWorldListDrawer],
  );
  const mainLeft = useMemo(
    () => navDrawerWidth + 1 + (openDrawer ? listDrawerWidth + 1 : 0),
    [openDrawer],
  );
  const mainWidth = useMemo(
    () =>
      `calc(100% - ${navDrawerWidth + 1 + (openDrawer ? listDrawerWidth + 1 : 0)}px)`,
    [openDrawer],
  );
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
      <Box sx={{ height: 1, width: 1, overflow: 'hidden', display: 'flex' }}>
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
        <HelloDrawer
          open={openHelloListDrawer}
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
        <WorldDrawer
          open={openWorldListDrawer}
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
