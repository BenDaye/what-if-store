import { useAuth, useNotice } from '@/hooks';
import type { OverridesButtonProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
import { DownloadDone as OwnedIcon, GetApp as OwnIcon } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo } from 'react';

type OwnApplicationButtonProps = OverridesButtonProps & {
  applicationId: string;
  showText?: boolean;
  text?: string;
};
export const OwnApplicationButton = ({
  overrides,
  applicationId,
  text,
  showText = false,
}: OwnApplicationButtonProps) => {
  const { t } = useTranslation();

  const { status, data: session } = useSession();

  const { signIn } = useAuth();

  const { showWarning } = useNotice();

  const {
    data: owned,
    isFetching,
    refetch,
  } = trpc.protectedAppApplication.isOwnedById.useQuery(applicationId, {
    enabled:
      status === 'authenticated' &&
      (session.user?.role === AuthRole.User || session.user?.role === AuthRole.Provider),
    placeholderData: false,
  });
  const { mutateAsync: own, isPending: isOwnPending } = trpc.protectedAppApplication.ownById.useMutation({
    onError: (err) => showWarning(err.message),
    onSuccess: () => refetch(),
  });

  const onClick = useCallback(async () => {
    if (status !== 'authenticated') {
      signIn();
      return;
    }
    await own(applicationId).catch(() => null);
  }, [status, signIn, own, applicationId]);

  const disabled = useMemo(() => isFetching || isOwnPending, [isFetching, isOwnPending]);

  return showText || text ? (
    <Button
      size="small"
      color={owned ? 'primary' : 'inherit'}
      startIcon={owned ? <OwnedIcon /> : <OwnIcon />}
      onClick={onClick}
      disabled={disabled}
      {...overrides?.ButtonProps}
    >
      {text ?? (owned ? t('application:Own.Owned') : t('application:Own.Own'))}
    </Button>
  ) : (
    <IconButton
      color={owned ? 'primary' : 'inherit'}
      sx={{
        fontSize: (theme) => theme.typography.body1.fontSize,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {owned ? <OwnedIcon sx={{ fontSize: 'inherit' }} /> : <OwnIcon sx={{ fontSize: 'inherit' }} />}
    </IconButton>
  );
};
