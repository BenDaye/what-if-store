import { IconButtonWithTooltip } from '@/components/common';
import {
  Apps as AppsIcon,
  Dashboard as DashboardIcon,
  People as UsersIcon,
} from '@mui/icons-material';
import { Box, Drawer, DrawerProps } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { DashboardSettingsIconButton } from './settings/SettingsIconButton';

export const DashboardNavDrawer = (props: DrawerProps) => {
  const router = useRouter();
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
          onClick={() => router.push('/dashboard')}
          active={
            router.pathname === '/dashboard' ||
            router.pathname === '/dashboard/'
          }
        />
        <IconButtonWithTooltip
          title={tCommon('Users')}
          icon={<UsersIcon />}
          onClick={() => router.push('/dashboard/user')}
          active={router.pathname.startsWith('/dashboard/user')}
        />
        <IconButtonWithTooltip
          title={tCommon('Apps')}
          icon={<AppsIcon />}
          onClick={() => router.push('/dashboard/app')}
          active={router.pathname.startsWith('/dashboard/app')}
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
