import { useDashboardProvider } from '@/hooks';
import {
  NewReleases as UnverifiedIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { Link, LinkProps, SvgIconProps } from '@mui/material';

type ProviderLinkProps = {
  providerId: string;
  overrides?: {
    LinkProps?: LinkProps;
    SvgIconProps?: SvgIconProps;
  };
};

export const ProviderLink = ({ providerId, overrides }: ProviderLinkProps) => {
  const {
    data: { name, verified },
  } = useDashboardProvider(providerId);
  return (
    <Link
      href={`/dashboard/provider/${providerId}`}
      sx={{ display: 'flex', alignItems: 'center' }}
      color={verified ? 'primary.main' : 'text.secondary'}
      {...overrides?.LinkProps}
    >
      {verified ? (
        <VerifiedIcon
          sx={{ fontSize: (theme) => theme.typography.button.fontSize }}
          {...overrides?.SvgIconProps}
        />
      ) : (
        <UnverifiedIcon
          sx={{ fontSize: (theme) => theme.typography.button.fontSize }}
          {...overrides?.SvgIconProps}
        />
      )}
      {name}
    </Link>
  );
};
