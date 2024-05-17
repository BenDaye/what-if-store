import { useAppUser } from '@/hooks';
import { OverridesProps } from '@/types/overrides';
import { Verified as VerifiedIcon } from '@mui/icons-material';
import { Link, LinkProps, Stack } from '@mui/material';
import { UserLink } from '../user';

type ProviderLinkProps = OverridesProps<{ LinkProps?: LinkProps }> & {
  providerId: string;
  showUser?: boolean;
};
export const ProviderLink = ({
  providerId,
  showUser = true,
  overrides,
}: ProviderLinkProps) => {
  const {
    data: { providerName, provider },
  } = useAppUser(providerId);
  return (
    <Stack direction={'row'} gap={1}>
      {showUser && <UserLink userId={providerId} />}
      {provider && (
        <>
          {provider.verified && <VerifiedIcon />}
          <Link href={`/provider/${provider.id}`} {...overrides?.LinkProps}>
            @{providerName}
          </Link>
        </>
      )}
    </Stack>
  );
};
