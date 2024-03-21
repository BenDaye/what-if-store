import { Home as HomeIcon } from '@mui/icons-material';
import { Box, Drawer, DrawerProps } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { IconButtonWithTooltip } from '../common';
import { AppSettingsIconButton } from './settings/SettingsIconButton';

export const AppNavDrawer = (props: DrawerProps) => {
  const { pathname, push } = useRouter();
  const { t: tCommon } = useTranslation('common');
  return (
    <Drawer
      {...props}
      variant={props.variant ?? 'permanent'}
      ModalProps={props.ModalProps ?? { keepMounted: true }}
      sx={
        props.sx ?? {
          width: 49,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            zIndex: (theme) => theme.zIndex.drawer + 10,
            width: 49,
            boxSizing: 'border-box',
          },
        }
      }
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
        <IconButtonWithTooltip
          title={tCommon('Applications')}
          icon={<HomeIcon />}
          onClick={() => push('/app/hello')}
          active={pathname === '/app/hello' || pathname === '/app/hello/'}
        />
        <IconButtonWithTooltip
          title={tCommon('Applications')}
          icon={<HomeIcon />}
          onClick={() => push('/app/world')}
          active={pathname === '/app/world' || pathname === '/app/world/'}
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
        <AppSettingsIconButton />
      </Box>
    </Drawer>
  );
};
