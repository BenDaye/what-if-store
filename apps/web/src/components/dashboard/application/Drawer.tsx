import type { OverridesDrawerProps } from '@/types/overrides';
import { AppBar, Drawer, Toolbar, Typography } from '@mui/material';
import { ApplicationList } from './List';

export const ApplicationDrawer = ({ overrides }: OverridesDrawerProps) => {
  return (
    <Drawer {...overrides?.DrawerProps}>
      <AppBar color="inherit">
        <Toolbar sx={{ flexShrink: 0, gap: 1, px: 2 }} variant="dense" disableGutters>
          <Typography variant="subtitle2">Application Drawer</Typography>
        </Toolbar>
      </AppBar>

      <ApplicationList disablePadding dense />
    </Drawer>
  );
};
