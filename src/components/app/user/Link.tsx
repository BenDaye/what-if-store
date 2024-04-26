import { useAppUser } from '@/hooks';
import { OverridesProps } from '@/types/overrides';
import { Link, LinkProps } from '@mui/material';

type UserLinkProps = OverridesProps<{ LinkProps?: LinkProps }> & {
  userId: string;
};
export const UserLink = ({ userId, overrides }: UserLinkProps) => {
  const {
    data: { nickname },
  } = useAppUser(userId);
  return (
    <>
      <Link href={`/user/${userId}`} {...overrides?.LinkProps}>
        {nickname}
      </Link>
    </>
  );
};
