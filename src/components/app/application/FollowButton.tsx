import { UseAppApplicationHookDataSchema, useAuth, useNotice } from '@/hooks';
import { OverridesButtonProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
import {
  FavoriteBorder as FollowIcon,
  Favorite as FollowedIcon,
} from '@mui/icons-material';
import { Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo } from 'react';

type FollowApplicationButtonProps = OverridesButtonProps & {
  applicationId: string;
  followers: UseAppApplicationHookDataSchema['followers'];
};
export const FollowApplicationButton = ({
  overrides,
  applicationId,
  followers,
}: FollowApplicationButtonProps) => {
  const { t: tApplicationFollow } = useTranslation('application', {
    keyPrefix: 'Follow',
  });

  const { status, data: session } = useSession();
  const followed = useMemo(
    () => followers.some((item) => item.id === session?.user?.id),
    [session?.user?.id, followers],
  );

  const { signIn } = useAuth();

  const { showWarning } = useNotice();

  const { mutateAsync: follow } =
    trpc.protectedAppApplication.followById.useMutation({
      onError: (err) => showWarning(err.message),
    });

  const onClick = useCallback(async () => {
    if (status !== 'authenticated') {
      signIn();
      return;
    }
    await follow(applicationId).catch(() => null);
  }, [status, signIn, follow, applicationId]);

  return (
    <Button
      size="small"
      color={followed ? 'error' : 'inherit'}
      startIcon={followed ? <FollowedIcon /> : <FollowIcon />}
      onClick={onClick}
      {...overrides?.ButtonProps}
    >
      {tApplicationFollow(followed ? 'Followed' : 'Follow')}
    </Button>
  );
};
