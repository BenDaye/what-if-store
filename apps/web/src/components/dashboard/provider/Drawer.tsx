import type { OverridesDrawerProps } from '@/types/overrides';
import { AppBar, Drawer, Toolbar, Typography } from '@mui/material';
import { ProviderList } from './List';

export const ProviderDrawer = ({ overrides }: OverridesDrawerProps) => {
  return (
    <Drawer {...overrides?.DrawerProps}>
      <AppBar color="inherit">
        <Toolbar sx={{ flexShrink: 0, gap: 1, px: 2 }} variant="dense" disableGutters>
          <Typography variant="subtitle2">Provider Drawer</Typography>
        </Toolbar>
      </AppBar>

      <ProviderList disablePadding dense />
    </Drawer>
  );
};
