import { Home as HelloIcon, Abc as WorldIcon } from '@mui/icons-material';
import { Box, Drawer, DrawerProps } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { IconButtonWithTooltip } from '../common';
import { AppSettingsIconButton } from './settings/SettingsIconButton';

export const AppNavDrawer = (props: DrawerProps) => {
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
          title={tCommon('Hello')}
          icon={<HelloIcon />}
          onClick={() => router.push('/app/hello')}
          active={router.pathname.startsWith('/app/hello')}
        />
        <IconButtonWithTooltip
          title={tCommon('World')}
          icon={<WorldIcon />}
          onClick={() => router.push('/app/world')}
          active={router.pathname.startsWith('/app/world')}
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
