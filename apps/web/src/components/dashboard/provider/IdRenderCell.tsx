import { useDashboardUser } from '@/hooks';
import type { IdSchema } from '@/server/schemas';
import type { LinkProps, TypographyProps } from '@mui/material';
import { Link, Typography } from '@mui/material';

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
