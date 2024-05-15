import { AuthIconButton, IconButtonWithTooltip } from '@/components/common';
import { OverridesDrawerProps } from '@/types/overrides';
import {
  Apps as ApplicationsIcon,
  Store as DashboardIcon,
  Dns as ProvidersIcon,
  UploadFile as UploadIcon,
  Person as UsersIcon,
} from '@mui/icons-material';
import { Box, Drawer } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { DashboardSettingsIconButton } from './settings/SettingsIconButton';

type DashboardNavDrawerProps = OverridesDrawerProps;
export const DashboardNavDrawer = ({ overrides }: DashboardNavDrawerProps) => {
  const { pathname, push } = useRouter();
  const { t } = useTranslation();
  return (
    <Drawer variant="permanent" {...overrides?.DrawerProps}>
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
          title={t('common:Dashboard')}
          icon={<DashboardIcon />}
          onClick={() => push('/dashboard')}
          active={pathname === '/dashboard' || pathname === '/dashboard/'}
        />
        <IconButtonWithTooltip
          title={t('common:Applications')}
          icon={<ApplicationsIcon />}
          onClick={() => push('/dashboard/application')}
          active={pathname.startsWith('/dashboard/application')}
        />
        <IconButtonWithTooltip
          title={t('common:Providers')}
          icon={<ProvidersIcon />}
          onClick={() => push('/dashboard/provider')}
          active={pathname.startsWith('/dashboard/provider')}
        />
        <IconButtonWithTooltip
          title={t('common:Users')}
          icon={<UsersIcon />}
          onClick={() => push('/dashboard/user')}
          active={pathname.startsWith('/dashboard/user')}
        />
        <IconButtonWithTooltip
          title={t('common:Upload')}
          icon={<UploadIcon />}
          onClick={() => push('/dashboard/upload')}
          active={pathname.startsWith('/dashboard/upload')}
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
        <DashboardSettingsIconButton />
      </Box>
    </Drawer>
  );
};
