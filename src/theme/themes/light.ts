import {
  blue,
  deepOrange,
  green,
  grey,
  lightBlue,
  orange,
  red,
} from '@mui/material/colors';
import { zhCN } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: {
        main: blue[600],
      },
      secondary: {
        main: deepOrange[600],
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
        main: lightBlue[400],
      },
      background: {
        paper: grey[50],
        default: grey.A100,
      },
    },
    components: {
      MuiDialog: {
        defaultProps: {
          disableEscapeKeyDown: true,
          fullWidth: true,
          maxWidth: 'xs',
        },
      },
      MuiDialogContent: {
        defaultProps: {
          dividers: true,
        },
      },
      MuiDialogActions: {
        defaultProps: {
          sx: {
            gap: 1,
          },
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
      MuiLink: {
        defaultProps: {
          underline: 'hover',
          sx: {
            cursor: 'pointer',
          },
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
