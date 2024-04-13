import { useNotice } from '@/hooks';
import { UserUpdateProfileInputSchema } from '@/server/schemas/user';
import { OverridesDialogProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
import { Close as CloseIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  AppBar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

type AppAuthUpdateProfileDialogProps = OverridesDialogProps;
export const AppAuthUpdateProfileDialog = ({
  overrides,
  DialogProps,
}: AppAuthUpdateProfileDialogProps) => {
  const { showError, showSuccess } = useNotice();
  const { t: tCommon } = useTranslation('common');
  const { t: tUser } = useTranslation('user');

  const { data: session, status, update: updateSession } = useSession();
  const unauthenticated = useMemo(
    () =>
      status !== 'authenticated' ||
      (session.user?.role !== AuthRole.User &&
        session.user?.role !== AuthRole.Provider),
    [session, status],
  );
  const { handleSubmit, control, reset } =
    useForm<UserUpdateProfileInputSchema>({
      defaultValues: {
        nickname: session?.user?.nickname ?? null,
        email: session?.user?.email ?? null,
        avatar: session?.user?.avatar ?? null,
        bio: session?.user?.bio ?? null,
      },
    });
  useEffect(() => {
    if (session?.user) reset(session.user, { keepDefaultValues: false });
  }, [session, reset]);
  const { mutateAsync: updateProfile } =
    trpc.protectedAppUser.update.useMutation({
      onError: (err) => showError(err.message),
      onSuccess: (res) => {
        showSuccess(tUser('Profile.Updated'));
        updateSession(res);
        DialogProps.onClose?.({}, 'backdropClick');
      },
    });
  const onSubmit = async (data: UserUpdateProfileInputSchema) => {
    await updateProfile({
      nickname: data.nickname ?? null,
      email: data.email ?? null,
      avatar: data.avatar ?? null,
      bio: data.bio ?? null,
    })
      .then(() => DialogProps?.onClose?.({}, 'backdropClick'))
      .catch(() => null);
  };

  const onClose = useCallback(() => {
    if (session?.user) reset(session.user, { keepDefaultValues: false });
    DialogProps?.onClose?.({}, 'backdropClick');
  }, [reset, DialogProps, session]);

  return (
    <Dialog onClose={onClose} {...DialogProps}>
      <AppBar elevation={0} {...overrides?.AppBarProps}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Typography variant="subtitle1">{tUser('Profile.Update')}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            edge="end"
            onClick={onClose}
            disabled={status === 'loading'}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent {...overrides?.DialogContentProps}>
        <Controller
          control={control}
          name="nickname"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error?.message ?? ' '}
              label={tUser('Profile.Nickname')}
              placeholder={tUser('Profile.Nickname')}
              autoFocus
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error?.message ?? ' '}
              type="email"
              label={tUser('Profile.Email')}
              placeholder={tUser('Profile.Email')}
            />
          )}
        />
      </DialogContent>
      <DialogActions {...overrides?.DialogActionsProps}>
        <Box sx={{ flexGrow: 1 }}></Box>
        <LoadingButton
          loading={status === 'loading'}
          disabled={unauthenticated}
          onClick={() => handleSubmit(onSubmit)()}
        >
          {tCommon('Submit')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
