import { useAuth, useDashboardUserMy } from '@/hooks';
import { UserUpdateProfileInputSchema } from '@/server/schemas/user';
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

type DashboardUserUpdateProfileDialogProps = DialogProps;
export const DashboardUserUpdateProfileDialog = (
  props: DashboardUserUpdateProfileDialogProps,
) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tAuth } = useTranslation('auth');
  const { t: tUser } = useTranslation('user');

  const { data: session, status } = useSession();
  const unauthenticated = useMemo(
    () => status !== 'authenticated' || session.user?.role !== AuthRole.Admin,
    [session, status],
  );
  const { update: updateProfile } = useDashboardUserMy();
  const { handleSubmit, control, reset, setValue } =
    useForm<UserUpdateProfileInputSchema>({
      defaultValues: {
        nickname: session?.user?.nickname ?? '',
        email: session?.user?.email ?? '',
        avatar: session?.user?.avatar ?? '',
        bio: session?.user?.bio ?? '',
      },
    });
  useEffect(() => {
    if (session?.user?.nickname) setValue('nickname', session.user.nickname);
    if (session?.user?.email) setValue('email', session.user.email);
    if (session?.user?.avatar) setValue('avatar', session.user.avatar);
    if (session?.user?.bio) setValue('bio', session.user.bio);
  }, [session, setValue]);

  const onSubmit = async (data: UserUpdateProfileInputSchema) => {
    await updateProfile({
      nickname: data.nickname ?? null,
      email: data.email ?? null,
      avatar: data.avatar ?? null,
      bio: data.bio ?? null,
    })
      .then(() => props?.onClose?.({}, 'backdropClick'))
      .catch(() => null);
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
      <AppBar position="static" enableColorOnDark elevation={0}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Typography variant="subtitle1" color="text.primary">
            {tUser('Profile.Update')}
          </Typography>
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
              variant="filled"
              value={value}
              onChange={onChange}
              fullWidth
              error={!!error}
              helperText={error?.message ?? ' '}
              margin="normal"
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
              variant="filled"
              onChange={onChange}
              fullWidth
              error={!!error}
              helperText={error?.message ?? ' '}
              margin="normal"
              type="email"
              label={tUser('Profile.Email')}
              placeholder={tUser('Profile.Email')}
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
