import {
  AppBar,
  Drawer,
  DrawerProps,
  Toolbar,
  Typography,
} from '@mui/material';
import { UserList } from './List';

export const UserDrawer = (props: DrawerProps) => {
  return (
    <Drawer {...props}>
      <AppBar color="inherit" position="static" elevation={1}>
        <Toolbar
          sx={{ flexShrink: 0, gap: 1, px: 2 }}
          variant="dense"
          disableGutters
        >
          <Typography variant="subtitle2">User Drawer</Typography>
        </Toolbar>
      </AppBar>

      <UserList disablePadding dense sx={{ overflowY: 'auto' }} />
    </Drawer>
  );
};
