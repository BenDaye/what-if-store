import type { AppBarProps, BoxProps, ToolbarProps } from '@mui/material';
import { AppBar, Box, Toolbar } from '@mui/material';
import type { OverlayScrollbarsComponentProps } from 'overlayscrollbars-react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import type { PropsWithChildren, ReactNode } from 'react';

type PageContainerPropsBase = {
  overrides?: {
    OuterBoxProps?: BoxProps;
    InnerBoxProps?: BoxProps;
    AppBarProps?: AppBarProps;
    ToolbarProps?: ToolbarProps;
    OverlayScrollbarsComponentProps?: OverlayScrollbarsComponentProps;
    PageBoxProps?: BoxProps;
  };
};

type PageContainerWithHeaderProps = PageContainerPropsBase & {
  hasHeader: true;
  header: ReactNode;
};

type PageContainerWithoutHeaderProps = PageContainerPropsBase & {
  hasHeader?: false;
  header?: undefined;
};

type PageContainerProps = PageContainerWithHeaderProps | PageContainerWithoutHeaderProps;

export const PageContainer = ({
  overrides,
  hasHeader,
  header,
  children,
}: PropsWithChildren<PageContainerProps>) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        flexGrow: 1,
        overflow: 'hidden',
      }}
      {...overrides?.OuterBoxProps}
    >
      {hasHeader && (
        <AppBar position="static" component="div" color="inherit" {...overrides?.AppBarProps}>
          <Toolbar sx={{ gap: 1 }} variant="dense" {...overrides?.ToolbarProps}>
            {header}
          </Toolbar>
        </AppBar>
      )}

      <Box
        sx={{
          flexGrow: 1,
          p: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
        {...overrides?.InnerBoxProps}
      >
        <OverlayScrollbarsComponent
          defer
          options={{
            scrollbars: {
              autoHide: 'leave',
            },
          }}
          {...overrides?.OverlayScrollbarsComponentProps}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              overflowY: 'auto',
              flexGrow: 1,
              p: 1,
            }}
            {...overrides?.PageBoxProps}
          >
            {children}
          </Box>
        </OverlayScrollbarsComponent>
      </Box>
    </Box>
  );
};
