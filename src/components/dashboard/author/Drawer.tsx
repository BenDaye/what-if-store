import {
  AppBar,
  Drawer,
  DrawerProps,
  Toolbar,
  Typography,
} from '@mui/material';
import { AuthorList } from './List';

export const AuthorDrawer = (props: DrawerProps) => {
  return (
    <Drawer {...props}>
      <AppBar color="inherit" position="static" elevation={1}>
        <Toolbar
          sx={{ flexShrink: 0, gap: 1, px: 2 }}
          variant="dense"
          disableGutters
        >
          <Typography variant="subtitle2">Author Drawer</Typography>
        </Toolbar>
      </AppBar>

      <AuthorList disablePadding dense sx={{ overflowY: 'auto' }} />
    </Drawer>
  );
};
