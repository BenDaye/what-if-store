import { useAuth, useNotice } from '@/hooks';
import { OverridesButtonProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
import {
  FavoriteBorder as FollowIcon,
  Favorite as FollowedIcon,
} from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo } from 'react';

type FollowApplicationButtonProps = OverridesButtonProps & {
  applicationId: string;
  showText?: boolean;
};
export const FollowApplicationButton = ({
  overrides,
  applicationId,
  showText = false,
}: FollowApplicationButtonProps) => {
  const { t } = useTranslation();

  const { status } = useSession();

  const { signIn } = useAuth();

  const { showWarning } = useNotice();

  const {
    data: followed,
    isFetching,
    refetch,
  } = trpc.protectedAppApplication.isFollowedById.useQuery(applicationId, {
    enabled: status === 'authenticated',
    placeholderData: false,
  });
  const { mutateAsync: follow, isPending: isFollowPending } =
    trpc.protectedAppApplication.followById.useMutation({
      onError: (err) => showWarning(err.message),
      onSuccess: () => refetch(),
    });
  const { mutateAsync: unfollow, isPending: isUnfollowPending } =
    trpc.protectedAppApplication.unfollowById.useMutation({
      onError: (err) => showWarning(err.message),
      onSuccess: () => refetch(),
    });

  const onClick = useCallback(async () => {
    if (status !== 'authenticated') {
      signIn();
      return;
    }

    if (followed) {
      await unfollow(applicationId).catch(() => null);
      return;
    }
    await follow(applicationId).catch(() => null);
  }, [status, signIn, followed, follow, unfollow, applicationId]);

  const disabled = useMemo(
    () => isFetching || isFollowPending || isUnfollowPending,
    [isFetching, isFollowPending, isUnfollowPending],
  );

  return showText ? (
    <Button
      size="small"
      color={followed ? 'error' : 'inherit'}
      startIcon={followed ? <FollowedIcon /> : <FollowIcon />}
      onClick={onClick}
      disabled={disabled}
      {...overrides?.ButtonProps}
    >
      {followed
        ? t('application:Follow.Followed')
        : t('application:Follow.Follow')}
    </Button>
  ) : (
    <IconButton
      color={followed ? 'error' : 'inherit'}
      sx={{
        fontSize: (theme) => theme.typography.body1.fontSize,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {followed ? (
        <FollowedIcon sx={{ fontSize: 'inherit' }} />
      ) : (
        <FollowIcon sx={{ fontSize: 'inherit' }} />
      )}
    </IconButton>
  );
};
