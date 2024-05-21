import { useDashboardUser } from '@/hooks';
import type { LinkProps } from '@mui/material';
import { Link, Stack } from '@mui/material';
import { ProviderLink } from '../provider';

type UserLinkProps = {
  userId: string;
  overrides?: {
    LinkProps?: LinkProps;
  };
  withUser?: boolean;
  withProvider?: boolean;
};

export const UserLink = ({ userId, withUser = true, withProvider = false, overrides }: UserLinkProps) => {
  const {
    data: { nickname, providerId },
  } = useDashboardUser(userId);
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {withUser && (
        <Link href={`/dashboard/user/${userId}`} color="text.primary" {...overrides?.LinkProps}>
          {nickname}
        </Link>
      )}
      {withProvider && providerId && <ProviderLink providerId={providerId} />}
    </Stack>
  );
};
