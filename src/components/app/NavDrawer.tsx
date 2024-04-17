import {
  AuthIconButton,
  IconButtonWithTooltip,
  PrimaryDrawerRnd,
} from '@/components/common';
import {
  APP_PRIMARY_DRAWER_WIDTH,
  APP_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
} from '@/constants/drawer';
import { OverridesDrawerProps } from '@/types/overrides';
import {
  Apps as ApplicationsIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { Box, Drawer } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useLocalStorage } from 'usehooks-ts';
import { AppSettingsIconButton } from './settings/SettingsIconButton';

type AppNavDrawerProps = OverridesDrawerProps;
export const AppNavDrawer = ({ overrides }: AppNavDrawerProps) => {
  const { pathname, push } = useRouter();
  const { t } = useTranslation();
  const [primaryDrawerWidth] = useLocalStorage<number>(
    APP_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
    APP_PRIMARY_DRAWER_WIDTH,
    {
      initializeWithValue: false,
    },
  );
  return (
    <>
      <PrimaryDrawerRnd />
      <Drawer
        variant="permanent"
        sx={{
          [`& .MuiDrawer-paper`]: {
            zIndex: (theme) => theme.zIndex.drawer + 10,
            width: primaryDrawerWidth,
            boxSizing: 'border-box',
          },
        }}
        {...overrides?.DrawerProps}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            bgcolor: (theme) => theme.palette.background.paper,
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.05))`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            py: 2,
          }}
        >
          <IconButtonWithTooltip
            title={t('common:Home')}
            icon={<HomeIcon />}
            onClick={() => push('/app')}
            active={pathname === '/app' || pathname === '/app/'}
          />
          <IconButtonWithTooltip
            title={t('common:Applications')}
            icon={<ApplicationsIcon />}
            onClick={() => push('/app/application')}
            active={pathname.startsWith('/app/application')}
          />
        </Box>
        <Box
          component="footer"
          sx={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            py: 2,
          }}
        >
          <AuthIconButton />
          <AppSettingsIconButton />
        </Box>
      </Drawer>
    </>
  );
};
