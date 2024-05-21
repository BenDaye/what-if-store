import type { IdSchema } from '@/server/schemas';
import type { OverridesCardProps, OverridesProps } from '@/types/overrides';
import type { PaperProps, StackProps } from '@mui/material';
import { Card, CardContent, Paper, Stack } from '@mui/material';
import type { PropsWithChildren } from 'react';
import type { NavListProps } from './NavList';
import { NavList } from './NavList';

type PageProps = OverridesProps<
  {
    PaperProps?: PaperProps;
    StackProps?: StackProps;
    NavListProps?: NavListProps;
  } & OverridesCardProps['overrides']
> & {
  applicationId: IdSchema;
};

export const Page = ({ applicationId, overrides, children }: PropsWithChildren<PageProps>) => {
  return (
    <Stack direction="row" spacing={2} sx={{ width: 1 }} alignItems="flex-start" {...overrides?.StackProps}>
      <Paper sx={{ width: 240, flexShrink: 0 }} {...overrides?.PaperProps}>
        <NavList applicationId={applicationId} {...overrides?.NavListProps} />
      </Paper>
      <Card sx={{ flexGrow: 1 }} {...overrides?.CardProps}>
        <CardContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          {...overrides?.CardContentProps}
        >
          {children}
        </CardContent>
      </Card>
    </Stack>
  );
};
