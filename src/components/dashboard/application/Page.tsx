import { IdSchema } from '@/server/schemas';
import { Paper, PaperProps, Stack, StackProps } from '@mui/material';
import { PropsWithChildren } from 'react';
import { NavList, NavListProps } from './NavList';

type PageProps = {
  applicationId: IdSchema;
  overrides?: {
    PaperProps?: PaperProps;
    StackProps?: StackProps;
    NavListProps?: NavListProps;
  };
};

export const Page = ({
  applicationId,
  overrides,
  children,
}: PropsWithChildren<PageProps>) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ width: 1 }}
      alignItems="flex-start"
      {...overrides?.StackProps}
    >
      <Paper sx={{ width: 240, flexShrink: 0 }} {...overrides?.PaperProps}>
        <NavList applicationId={applicationId} {...overrides?.NavListProps} />
      </Paper>
      {children}
    </Stack>
  );
};
