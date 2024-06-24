import { useDashboardUser } from '@/hooks';
import type { LinkProps, TypographyProps } from '@mui/material';
import { Link, Typography } from '@mui/material';
import type { IdSchema } from '@what-if-store/server/server/schemas';

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
