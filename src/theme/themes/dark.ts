import {
  amber,
  cyan,
  green,
  grey,
  orange,
  purple,
  red,
} from '@mui/material/colors';
import { zhCN } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme(
  {
    palette: {
      mode: 'dark',
      primary: {
        main: amber[600],
      },
      secondary: {
        main: purple[600],
      },
      success: {
        main: green[600],
      },
      error: {
        main: red[600],
      },
      warning: {
        main: orange[600],
      },
      info: {
        main: cyan[600],
      },
      background: {
        paper: grey[900],
        default: '#121212',
      },
    },
    components: {
      MuiDialog: {
        defaultProps: {
          disableEscapeKeyDown: true,
        },
      },
      MuiDialogContent: {
        defaultProps: {
          dividers: true,
        },
      },
      MuiAppBar: {
        defaultProps: {
          position: 'static',
          elevation: 1,
          enableColorOnDark: true,
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'filled',
          fullWidth: true,
        },
      },
      MuiDrawer: {
        defaultProps: {
          variant: 'persistent',
          ModalProps: { keepMounted: true },
        },
      },
      MuiChip: {
        defaultProps: {
          sx: {
            borderRadius: 1,
          },
          size: 'small',
        },
      },
      MuiListItemText: {
        defaultProps: {
          primaryTypographyProps: {
            noWrap: true,
            textOverflow: 'ellipsis',
          },
        },
      },
      MuiAvatar: {
        defaultProps: {
          variant: 'rounded',
        },
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  },
  zhCN,
);
