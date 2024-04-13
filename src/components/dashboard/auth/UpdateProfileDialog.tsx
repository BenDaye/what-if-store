import { useDashboardUserMy } from '@/hooks';
import {
  UserUpdateProfileInputSchema,
  userUpdateProfileInputSchema,
} from '@/server/schemas/user';
import { OverridesDialogProps } from '@/types/overrides';
import { zodResolver } from '@hookform/resolvers/zod';
import { Close as CloseIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  AppBar,
  Avatar,
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
import { useDebounceValue } from 'usehooks-ts';

type DashboardAuthUpdateProfileDialogProps = OverridesDialogProps;

export const DashboardAuthUpdateProfileDialog = ({
  overrides,
  DialogProps,
}: DashboardAuthUpdateProfileDialogProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tUser } = useTranslation('user');

  const { data: session, status } = useSession();
  const unauthenticated = useMemo(
    () => status !== 'authenticated' || session.user?.role !== AuthRole.Admin,
    [session, status],
  );
  const { update: updateProfile } = useDashboardUserMy();
  const { handleSubmit, control, reset, setValue, getValues, watch } =
    useForm<UserUpdateProfileInputSchema>({
      defaultValues: {
        nickname: session?.user?.nickname ?? null,
        email: session?.user?.email ?? null,
        avatar: session?.user?.avatar ?? null,
        bio: session?.user?.bio ?? null,
      },
      mode: 'all',
      resolver: zodResolver(userUpdateProfileInputSchema),
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
      .then(() => DialogProps?.onClose?.({}, 'backdropClick'))
      .catch(() => null);
  };

  const [avatarSrc, setAvatarSrc] = useDebounceValue(
    session?.user?.avatar,
    1500,
  );

  useEffect(() => {
    setAvatarSrc(watch('avatar'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('avatar'), setAvatarSrc]);

  const onClose = useCallback(() => {
    reset(session?.user ?? {});
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
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar src={avatarSrc || undefined} sx={{ height: 128, width: 128 }}>
            {getValues('nickname')?.charAt(0) ?? '-'}
          </Avatar>
        </Box>
        <Controller
          control={control}
          name="avatar"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error?.message ?? ' '}
              label={tUser('Profile.Avatar')}
              placeholder={tUser('Profile.Avatar')}
            />
          )}
        />
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
        <Controller
          control={control}
          name="bio"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error?.message ?? ' '}
              label={tUser('Profile.Bio')}
              placeholder={tUser('Profile.Bio')}
              multiline
              maxRows={3}
            />
          )}
        />
      </DialogContent>
      <DialogActions sx={{ gap: 1 }}>
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
