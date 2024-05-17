import { useDashboardUser } from '@/hooks';
import { IdSchema } from '@/server/schemas';
import { Link, LinkProps, Typography, TypographyProps } from '@mui/material';

type IdRenderCellProps = {
  providerId: IdSchema;
  overrides?: { LinkProps?: LinkProps; TypographyProps?: TypographyProps };
};

export const IdRenderCell = ({ providerId, overrides }: IdRenderCellProps) => {
  const {
    data: { provider, providerName },
  } = useDashboardUser(providerId);
  if (!provider) {
    return <Typography>{providerId}</Typography>;
  }
  return (
    <Link href={`/dashboard/provider/${providerId}`} {...overrides?.LinkProps}>
      {providerName}
    </Link>
  );
};
