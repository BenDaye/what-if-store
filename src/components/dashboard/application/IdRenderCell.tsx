import { useDashboardApplication } from '@/hooks';
import { IdSchema } from '@/server/schemas';
import { Link, LinkProps, Typography, TypographyProps } from '@mui/material';

type IdRenderCellProps = {
  applicationId: IdSchema;
  overrides?: { LinkProps?: LinkProps; TypographyProps?: TypographyProps };
};

export const IdRenderCell = ({
  applicationId,
  overrides,
}: IdRenderCellProps) => {
  const { isError, error, isFetching, name } =
    useDashboardApplication(applicationId);
  if (isFetching) {
    return <Typography>...</Typography>;
  }
  if (isError) {
    return <Typography color="error">{error?.message}</Typography>;
  }
  return (
    <Link
      href={`/dashboard/application/${applicationId}`}
      underline="hover"
      {...overrides?.LinkProps}
    >
      {name}
    </Link>
  );
};
