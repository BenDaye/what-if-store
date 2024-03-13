import {
  AppBar,
  Drawer,
  DrawerProps,
  Toolbar,
  Typography,
} from '@mui/material';
import { ProviderList } from './List';

export const ProviderDrawer = (props: DrawerProps) => {
  return (
    <Drawer {...props}>
      <AppBar color="inherit" position="static" elevation={1}>
        <Toolbar
          sx={{ flexShrink: 0, gap: 1, px: 2 }}
          variant="dense"
          disableGutters
        >
          <Typography variant="subtitle2">Provider Drawer</Typography>
        </Toolbar>
      </AppBar>

      <ProviderList disablePadding dense />
    </Drawer>
  );
};
