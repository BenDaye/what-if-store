import { UseAppApplicationHookDataSchema, useAuth, useNotice } from '@/hooks';
import { OverridesButtonProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
import {
  GetApp as OwnIcon,
  DownloadDone as OwnedIcon,
} from '@mui/icons-material';
import { Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo } from 'react';

type OwnApplicationButtonProps = OverridesButtonProps & {
  applicationId: string;
  owners: UseAppApplicationHookDataSchema['owners'];
};
export const OwnApplicationButton = ({
  overrides,
  applicationId,
  owners,
}: OwnApplicationButtonProps) => {
  const { t: tApplicationOwn } = useTranslation('application', {
    keyPrefix: 'Own',
  });

  const { status, data: session } = useSession();
  const owned = useMemo(
    () => owners.some((item) => item.id === session?.user?.id),
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

  return (
    <Button
      size="small"
      color={owned ? 'error' : 'inherit'}
      startIcon={owned ? <OwnedIcon /> : <OwnIcon />}
      onClick={onClick}
      {...overrides?.ButtonProps}
    >
      {tApplicationOwn(owned ? 'Owned' : 'Own')}
    </Button>
  );
};
