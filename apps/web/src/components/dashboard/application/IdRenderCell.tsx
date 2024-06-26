import { useDashboardApplication } from '@/hooks';
import type { LinkProps, TypographyProps } from '@mui/material';
import { Link, Typography } from '@mui/material';
import type { IdSchema } from '@what-if-store/server/server/schemas';

type IdRenderCellProps = {
  applicationId: IdSchema;
  overrides?: { LinkProps?: LinkProps; TypographyProps?: TypographyProps };
};

export const IdRenderCell = ({ applicationId, overrides }: IdRenderCellProps) => {
  const {
    router: { isError, error, isFetching },
    data: { name },
  } = useDashboardApplication(applicationId);
  if (isFetching) {
    return <Typography>...</Typography>;
  }
  if (isError) {
    return <Typography color="error">{error?.message}</Typography>;
  }
  return (
    <Link href={`/dashboard/application/${applicationId}`} {...overrides?.LinkProps}>
      {name}
    </Link>
  );
};
