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
          elevation: 1,
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'filled',
          fullWidth: true,
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
