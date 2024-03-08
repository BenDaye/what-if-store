import { IconButtonWithTooltip } from '@/components/common';
import {
  Widgets as ApplicationsIcon,
  Engineering as AuthorsIcon,
  Dashboard as DashboardIcon,
  Person as UsersIcon,
} from '@mui/icons-material';
import { Box, Drawer, DrawerProps } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { DashboardSettingsIconButton } from './settings/SettingsIconButton';

export const DashboardNavDrawer = (props: DrawerProps) => {
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
          title={tCommon('Dashboard')}
          icon={<DashboardIcon />}
          onClick={() => push('/dashboard')}
          active={pathname === '/dashboard' || pathname === '/dashboard/'}
        />
        <IconButtonWithTooltip
          title={tCommon('Apps')}
          icon={<ApplicationsIcon />}
          onClick={() => push('/dashboard/application')}
          active={pathname.startsWith('/dashboard/application')}
        />
        <IconButtonWithTooltip
          title={tCommon('Authors')}
          icon={<AuthorsIcon />}
          onClick={() => push('/dashboard/author')}
          active={pathname.startsWith('/dashboard/author')}
        />
        <IconButtonWithTooltip
          title={tCommon('Users')}
          icon={<UsersIcon />}
          onClick={() => push('/dashboard/user')}
          active={pathname.startsWith('/dashboard/user')}
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
        <DashboardSettingsIconButton />
      </Box>
    </Drawer>
  );
};
