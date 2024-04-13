import { useAuth, useNotice } from '@/hooks';
import { ProviderUpdateProfileInputSchema } from '@/server/schemas';
import { UserUpdateProfileInputSchema } from '@/server/schemas/user';
import { trpc } from '@/utils/trpc';
import { Close as CloseIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

type DashboardProviderUpdateProfileDialogProps = DialogProps;
export const DashboardProviderUpdateProfileDialog = (
  props: DashboardProviderUpdateProfileDialogProps,
) => {
  const { showError, showSuccess } = useNotice();
  const { t: tCommon } = useTranslation('common');
  const { t: tAuth } = useTranslation('auth');
  const { data: session, status, update: updateSession } = useSession();
  const unauthenticated = useMemo(
    () => status !== 'authenticated' || session.user?.role !== AuthRole.Admin,
    [session, status],
  );
  const { handleSubmit, control, reset, setValue } =
    useForm<ProviderUpdateProfileInputSchema>({
      defaultValues: {
        nickname: session?.user?.name ?? '',
        email: session?.user?.email ?? '',
      },
    });
  useEffect(() => {
    if (session?.user?.name) setValue('nickname', session.user.name);
    if (session?.user?.email) setValue('email', session.user.email);
  }, [session, setValue]);
  const { mutateAsync: updateProfile } =
    trpc.protectedDashboardUser.update.useMutation({
      onError: (err) => showError(err.message),
      onSuccess: ({ nickname, email }) => {
        showSuccess(tAuth('Profile.Updated'));
        updateSession({
          name: nickname,
          email,
        });
        props?.onClose?.({}, 'backdropClick');
      },
    });
  const onSubmit = async (data: UserUpdateProfileInputSchema) => {
    if (!data.nickname) data.nickname = null;
    if (!data.email) data.email = null;
    await updateProfile(data).catch(() => null);
  };
  const { signOut } = useAuth();
  return (
    <Dialog
      {...props}
      onClose={(ev, reason) => {
        reset({
          nickname: session?.user?.name ?? '',
          email: session?.user?.email ?? '',
        });
        props?.onClose?.(ev, reason);
      }}
    >
      <AppBar elevation={0}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Typography variant="subtitle1">{tAuth('Profile.Update')}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            edge="end"
            onClick={() => {
              reset({
                nickname: session?.user?.name ?? '',
                email: session?.user?.email ?? '',
              });
              props?.onClose?.({}, 'backdropClick');
            }}
            disabled={status === 'loading'}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent dividers>
        <Controller
          control={control}
          name="nickname"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error?.message ?? ' '}
              label={tAuth('Profile.Nickname')}
              placeholder={tAuth('Profile.Nickname')}
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
              label={tAuth('Profile.Email')}
              placeholder={tAuth('Profile.Email')}
            />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ gap: 1 }}>
        <Button
          color="error"
          disabled={status !== 'authenticated'}
          onClick={() =>
            signOut().then(() => props.onClose?.({}, 'backdropClick'))
          }
        >
          {tAuth('SignOut._')}
        </Button>
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
