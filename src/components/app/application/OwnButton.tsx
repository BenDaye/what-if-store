import { UseAppApplicationHookDataSchema, useAuth, useNotice } from '@/hooks';
import { OverridesButtonProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
import {
  GetApp as OwnIcon,
  DownloadDone as OwnedIcon,
} from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo } from 'react';

type OwnApplicationButtonProps = OverridesButtonProps & {
  applicationId: string;
  owners: UseAppApplicationHookDataSchema['owners'];
  showText?: boolean;
};
export const OwnApplicationButton = ({
  overrides,
  applicationId,
  owners,
  showText = false,
}: OwnApplicationButtonProps) => {
  const { t } = useTranslation();

  const { status, data: session } = useSession();
  const owned = useMemo(
    () => owners.some((item) => item.userId === session?.user?.id),
    [session?.user?.id, owners],
  );

  const { signIn } = useAuth();

  const { showWarning } = useNotice();

  const { mutateAsync: own } = trpc.protectedAppApplication.ownById.useMutation(
    {
      onError: (err) => showWarning(err.message),
    },
  );

  const onClick = useCallback(async () => {
    if (status !== 'authenticated') {
      signIn();
      return;
    }
    await own(applicationId).catch(() => null);
  }, [status, signIn, own, applicationId]);

  return showText ? (
    <Button
      size="small"
      color={owned ? 'primary' : 'inherit'}
      startIcon={owned ? <OwnedIcon /> : <OwnIcon />}
      onClick={onClick}
      {...overrides?.ButtonProps}
    >
      {owned ? t('application:Own.Owned') : t('application:Own.Own')}
    </Button>
  ) : (
    <IconButton
      color={owned ? 'primary' : 'inherit'}
      sx={{
        fontSize: (theme) => theme.typography.body1.fontSize,
      }}
      onClick={onClick}
    >
      {owned ? (
        <OwnedIcon sx={{ fontSize: 'inherit' }} />
      ) : (
        <OwnIcon sx={{ fontSize: 'inherit' }} />
      )}
    </IconButton>
  );
};
