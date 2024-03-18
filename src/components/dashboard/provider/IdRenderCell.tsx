import { useDashboardUser } from '@/hooks';
import { IdSchema } from '@/server/schemas';
import { Link, LinkProps, Typography, TypographyProps } from '@mui/material';

type IdRenderCellProps = {
  providerId: IdSchema;
  overrides?: { LinkProps?: LinkProps; TypographyProps?: TypographyProps };
};

export const IdRenderCell = ({ providerId, overrides }: IdRenderCellProps) => {
  const { data } = useDashboardUser(providerId);
  const providerProfile = data?.ProviderProfile;
  if (!providerProfile) {
    return <Typography>{providerId}</Typography>;
  }
  return (
    <Link
      href={`/dashboard/provider/${providerProfile.id}`}
      underline="hover"
      {...overrides?.LinkProps}
    >
      {providerProfile.name}
    </Link>
  );
};
