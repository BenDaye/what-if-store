import { useDashboardUser } from '@/hooks';
import { Link, LinkProps, Stack } from '@mui/material';
import { ProviderLink } from '../provider';

type UserLinkProps = {
  userId: string;
  overrides?: {
    LinkProps?: LinkProps;
  };
  withUser?: boolean;
  withProvider?: boolean;
};

export const UserLink = ({
  userId,
  withUser = true,
  withProvider = false,
  overrides,
}: UserLinkProps) => {
  const { data, nickname } = useDashboardUser(userId);
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {withUser && (
        <Link
          underline="hover"
          href={`/dashboard/user/${userId}`}
          color="text.primary"
          {...overrides?.LinkProps}
        >
          {nickname}
        </Link>
      )}
      {withProvider && data?.ProviderProfile && (
        <ProviderLink providerId={data.ProviderProfile.id} />
      )}
    </Stack>
  );
};
