import {
  DEFAULT_PRIMARY_DRAWER_WIDTH,
  DEFAULT_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
  DEFAULT_SECONDARY_DRAWER_WIDTH,
  DEFAULT_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
} from '@/constants/drawer';
import { Box } from '@mui/material';
import type { PropsWithChildren, ReactElement } from 'react';
import { useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Main } from './Main';

type DefaultLayoutProps = PropsWithChildren<{
  hasSecondaryDrawer?: boolean;
}>;

export const DefaultLayout = ({
  hasSecondaryDrawer = false,
  children,
}: DefaultLayoutProps): ReactElement<DefaultLayoutProps> => {
  const [primaryDrawerWidth] = useLocalStorage<number>(
    DEFAULT_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
    DEFAULT_PRIMARY_DRAWER_WIDTH,
    {
      initializeWithValue: false,
    },
  );
  const [secondaryDrawerWidth] = useLocalStorage<number>(
    DEFAULT_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
    DEFAULT_SECONDARY_DRAWER_WIDTH,
    {
      initializeWithValue: false,
    },
  );

  const mainLeft = useMemo(
    () => primaryDrawerWidth + (hasSecondaryDrawer ? secondaryDrawerWidth : 0),
    [primaryDrawerWidth, hasSecondaryDrawer, secondaryDrawerWidth],
  );
  const mainWidth = useMemo(
    () => `calc(100% - ${primaryDrawerWidth + (hasSecondaryDrawer ? secondaryDrawerWidth : 0)}px)`,
    [primaryDrawerWidth, hasSecondaryDrawer, secondaryDrawerWidth],
  );

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
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
  );
};
