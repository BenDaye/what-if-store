import { ExpandMore, NavigateNext } from '@mui/icons-material';
import {
  Box,
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
import { animated, easings, useSpring } from '@react-spring/web';
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentProps,
} from 'overlayscrollbars-react';
import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
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
  onClick?: ListItemButtonProps['onClick'];
};

export const CollapseListItemButton = ({
  overrides,
  primaryText,
  secondaryText,
  expandMore,
  onClick,
}: CollapseListItemButtonProps) => {
  return (
    <ListItemButton
      sx={{
        px: 1,
        py: 0,
        flexGrow: 0,
        flexShrink: 0,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.05)',
      }}
      divider
      onClick={onClick}
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
          primaryTypographyProps={{
            variant: 'caption',
            fontWeight: (theme) => theme.typography.fontWeightMedium,
          }}
          sx={{ my: 0 }}
          {...overrides?.ListItemTextProps}
        />
      )}

      {overrides?.listSecondary ?? (
        <Box sx={{ flexShrink: 0, maxWidth: 80 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontFamily: 'Roboto Mono',
              fontWeight: (theme) => theme.typography.fontWeightMedium,
            }}
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
    BoxProps?: HTMLAttributes<HTMLDivElement>;
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
  const styles = useSpring({
    flexGrow: expandMore ? 1 : 0,
    config: {
      easing: easings.easeInOutCirc,
      duration: 200,
    },
  });
  return (
    <animated.div
      style={{
        display: 'flex',
        flexShrink: 0,
        flexDirection: 'column',
        alignItems: 'stretch',
        overflowY: 'auto',
        flexBasis: 0,
        ...styles,
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
        <List disablePadding dense sx={{ minHeight }} {...overrides?.ListProps}>
          {overrides?.ListProps?.children ?? children}
        </List>
      </OverlayScrollbarsComponent>
    </animated.div>
  );
};

type CollapseListProps = {
  overrides?: {
    CollapseListItemButtonProps?: CollapseListItemButtonProps['overrides'];
    InnerCollapseListProps?: InnerCollapseListProps['overrides'];
  };
  primaryText: string;
  secondaryText?: string;
  minHeight?: number;
  localStorageKey?: string;
  defaultExpandMore?: boolean;
};

export const CollapseList = ({
  overrides,
  primaryText,
  secondaryText,
  minHeight = 240,
  localStorageKey,
  defaultExpandMore = true,
  children,
}: PropsWithChildren<CollapseListProps>) => {
  const [expandMore, setExpandMode] = useLocalStorage(
    `collapse-list-expand-more:${localStorageKey ?? primaryText}`,
    defaultExpandMore,
    {
      initializeWithValue: false,
    },
  );

  return (
    <>
      <CollapseListItemButton
        primaryText={primaryText}
        secondaryText={secondaryText}
        expandMore={expandMore}
        overrides={overrides?.CollapseListItemButtonProps}
        onClick={() => {
          setExpandMode(!expandMore);
        }}
      />
      <InnerCollapseList
        expandMore={expandMore}
        minHeight={minHeight}
        overrides={overrides?.InnerCollapseListProps}
      >
        {children}
      </InnerCollapseList>
    </>
  );
};
