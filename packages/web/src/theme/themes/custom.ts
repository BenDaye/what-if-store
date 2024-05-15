import {
  amber,
  cyan,
  deepPurple,
  orange,
  red,
  teal,
} from '@mui/material/colors';
import { zhCN } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme(
  {
    palette: {
      mode: 'dark',
      primary: {
        main: amber[700],
      },
      secondary: {
        main: deepPurple[500],
      },
      success: {
        main: teal[400],
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
        paper: deepPurple[400],
        default: deepPurple[300],
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
