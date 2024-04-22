import { UseAppApplicationHookDataSchema, useAuth, useNotice } from '@/hooks';
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
  followers: UseAppApplicationHookDataSchema['followers'];
  showText?: boolean;
};
export const FollowApplicationButton = ({
  overrides,
  applicationId,
  followers,
  showText = false,
}: FollowApplicationButtonProps) => {
  const { t } = useTranslation();

  const { status, data: session } = useSession();
  const followed = useMemo(
    () => followers.some((item) => item.userId === session?.user?.id),
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

  return showText ? (
    <Button
      size="small"
      color={followed ? 'error' : 'inherit'}
      startIcon={followed ? <FollowedIcon /> : <FollowIcon />}
      onClick={onClick}
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
    >
      {followed ? (
        <FollowedIcon sx={{ fontSize: 'inherit' }} />
      ) : (
        <FollowIcon sx={{ fontSize: 'inherit' }} />
      )}
    </IconButton>
  );
};
