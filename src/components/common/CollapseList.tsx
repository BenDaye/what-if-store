import { ExpandMore, NavigateNext } from '@mui/icons-material';
import {
  Box,
  BoxProps,
  Collapse,
  CollapseProps,
  List,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemIconProps,
  ListItemText,
  ListItemTextProps,
  ListProps,
  Typography,
  TypographyProps,
} from '@mui/material';
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentProps,
} from 'overlayscrollbars-react';
import { PropsWithChildren, ReactNode, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

type CollapseListItemButtonProps = {
  overrides?: {
    ListItemButtonProps?: ListItemButtonProps;
    ListItemIconProps?: ListItemIconProps;
    ListItemTextProps?: ListItemTextProps;
    TypographyProps?: TypographyProps;
    listPrimary?: ReactNode;
    listSecondary?: ReactNode;
  };
  primaryText?: string;
  secondaryText?: string;
  expandMore?: boolean;
};

export const CollapseListItemButton = ({
  overrides,
  primaryText,
  secondaryText,
  expandMore,
}: CollapseListItemButtonProps) => {
  return (
    <ListItemButton
      sx={{
        flexGrow: 0,
        flexShrink: 0,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.05)',
      }}
      divider
      {...overrides?.ListItemButtonProps}
    >
      <ListItemIcon
        sx={{ minWidth: (theme) => theme.spacing(3) }}
        {...overrides?.ListItemIconProps}
      >
        {overrides?.ListItemIconProps?.children ?? expandMore ? (
          <ExpandMore
            sx={{
              fontSize: (theme) => theme.typography.body2.fontSize,
            }}
          />
        ) : (
          <NavigateNext
            sx={{
              fontSize: (theme) => theme.typography.body2.fontSize,
            }}
          />
        )}
      </ListItemIcon>

      {overrides?.listPrimary ?? (
        <ListItemText
          primary={primaryText ?? ''}
          primaryTypographyProps={{ variant: 'caption' }}
          sx={{ my: 0 }}
          {...overrides?.ListItemTextProps}
        />
      )}

      {overrides?.listSecondary ?? (
        <Box sx={{ flexShrink: 0, maxWidth: 80 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontFamily: 'Roboto Mono' }}
            {...overrides?.TypographyProps}
          >
            {secondaryText ?? ''}
          </Typography>
        </Box>
      )}
    </ListItemButton>
  );
};

type InnerCollapseListProps = {
  overrides?: {
    BoxProps?: BoxProps;
    OverlayScrollbarsComponentProps?: OverlayScrollbarsComponentProps;
    CollapseProps?: CollapseProps;
    ListProps?: ListProps;
  };
  expandMore: boolean;
  minHeight?: number;
};

export const InnerCollapseList = ({
  expandMore,
  minHeight = 320,
  overrides,
  children,
}: PropsWithChildren<InnerCollapseListProps>) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: expandMore ? 1 : 0,
        flexDirection: 'column',
        alignItems: 'stretch',
        overflowY: 'auto',
      }}
      {...overrides?.BoxProps}
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
        <Collapse
          in={expandMore}
          timeout="auto"
          unmountOnExit={false}
          {...overrides?.CollapseProps}
        >
          <List
            disablePadding
            dense
            sx={{
              minHeight,
            }}
            {...overrides?.ListProps}
          >
            {overrides?.ListProps?.children ?? children}
          </List>
        </Collapse>
      </OverlayScrollbarsComponent>
    </Box>
  );
};

type CollapseListProps = {
  overrides?: {
    CollapseListItemButtonProps?: CollapseListItemButtonProps;
    InnerCollapseListProps?: InnerCollapseListProps;
    expandMore?: boolean;
  };
  primaryText: string;
  secondaryText?: string;
  expandMore?: boolean;
  minHeight?: number;
};

export const CollapseList = ({
  overrides,
  primaryText,
  secondaryText,
  minHeight,
  children,
}: PropsWithChildren<CollapseListProps>) => {
  const [expandMore, setExpandMode] = useLocalStorage(
    `collapse-list-expand-more:${primaryText}`,
    true,
    {
      initializeWithValue: false,
    },
  );
  const _expandMore = useMemo(
    () =>
      typeof overrides?.expandMore === 'boolean'
        ? overrides.expandMore
        : expandMore,
    [overrides?.expandMore, expandMore],
  );

  return (
    <>
      <CollapseListItemButton
        primaryText={primaryText}
        secondaryText={secondaryText}
        expandMore={_expandMore}
        overrides={{
          ListItemButtonProps: {
            onClick: () => {
              if (typeof overrides?.expandMore === 'boolean') return;
              setExpandMode(!_expandMore);
            },
          },
        }}
      />
      <InnerCollapseList
        expandMore={_expandMore}
        minHeight={minHeight}
        overrides={{}}
      >
        {children}
      </InnerCollapseList>
    </>
  );
};
