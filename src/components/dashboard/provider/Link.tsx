import { useDashboardUser } from '@/hooks';
import { Link, LinkProps, Typography } from '@mui/material';

type ProviderLinkProps = {
  providerId: string;
  overrides?: {
    LinkProps?: LinkProps;
  };
};

export const ProviderLink = ({ providerId, overrides }: ProviderLinkProps) => {
  const { data, nickname } = useDashboardUser(providerId);
  if (!data) {
    return <Typography color="text.secondary">-</Typography>;
  }
  if (!data.ProviderProfile) {
    return <Typography color="text.secondary">{nickname}</Typography>;
  }
  return (
    <Link
      underline="hover"
      href={`/dashboard/provider/${data.ProviderProfile.id}`}
      {...overrides?.LinkProps}
    >
      {data.ProviderProfile.name}
    </Link>
  );
};
