import type { OverridesDrawerProps } from '@/types/overrides';
import { AppBar, Drawer, Toolbar, Typography } from '@mui/material';
import { UserList } from './List';

export const UserDrawer = ({ overrides }: OverridesDrawerProps) => {
  return (
    <Drawer {...overrides?.DrawerProps}>
      <AppBar color="inherit">
        <Toolbar sx={{ flexShrink: 0, gap: 1, px: 2 }} variant="dense" disableGutters>
          <Typography variant="subtitle2">User Drawer</Typography>
        </Toolbar>
      </AppBar>

      <UserList disablePadding dense />
    </Drawer>
  );
};
