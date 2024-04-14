import { AuthIconButton, IconButtonWithTooltip } from '@/components/common';
import { OverridesDrawerProps } from '@/types/overrides';
import { Home as HomeIcon } from '@mui/icons-material';
import { Box, Drawer } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { AppSettingsIconButton } from './settings/SettingsIconButton';

type AppNavDrawerProps = OverridesDrawerProps;
export const AppNavDrawer = ({ overrides }: AppNavDrawerProps) => {
  const { pathname, push } = useRouter();
  const { t: tCommon } = useTranslation('common');
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 49,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          zIndex: (theme) => theme.zIndex.drawer + 10,
          width: 49,
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
          title={tCommon('Applications')}
          icon={<HomeIcon />}
          onClick={() => push('/app')}
          active={pathname === '/app' || pathname === '/app/'}
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
  );
};
