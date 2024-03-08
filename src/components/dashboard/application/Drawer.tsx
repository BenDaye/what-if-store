import {
  AppBar,
  Drawer,
  DrawerProps,
  Toolbar,
  Typography,
} from '@mui/material';
import { ApplicationList } from './List';

export const ApplicationDrawer = (props: DrawerProps) => {
  return (
    <Drawer {...props}>
      <AppBar color="inherit" position="static" elevation={1}>
        <Toolbar
          sx={{ flexShrink: 0, gap: 1, px: 2 }}
          variant="dense"
          disableGutters
        >
          <Typography variant="subtitle2">Application Drawer</Typography>
        </Toolbar>
      </AppBar>

      <ApplicationList disablePadding dense />
    </Drawer>
  );
};
