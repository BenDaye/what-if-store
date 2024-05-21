import { FallbackString } from '@/constants/common';
import { useNotice } from '@/hooks';
import type { UserUpdateProfileInputSchema } from '@/server/schemas/user';
import { userUpdateProfileInputSchema } from '@/server/schemas/user';
import type { OverridesDialogProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
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

type AuthUpdateProfileDialogProps = OverridesDialogProps;
export const AuthUpdateProfileDialog = ({ overrides, DialogProps }: AuthUpdateProfileDialogProps) => {
  const { showError, showSuccess } = useNotice();
  const { t } = useTranslation();

  const { data: session, status, update: updateSession } = useSession();
  const isUser = useMemo(
    () => session?.user?.role === AuthRole.User || session?.user?.role === AuthRole.Provider,
    [session?.user?.role],
  );
  const isAdmin = useMemo(() => session?.user?.role === AuthRole.Admin, [session?.user?.role]);

  const { handleSubmit, control, reset, getValues, watch } = useForm<UserUpdateProfileInputSchema>({
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
    if (session?.user) reset(session.user, { keepDefaultValues: false });
  }, [session, reset]);

  const { mutateAsync: updateUserProfile } = trpc.protectedAppUser.update.useMutation({
    onError: (err) => showError(err.message),
    onSuccess: () => {
      showSuccess(t('user:Profile.Updated'));
      updateSession();
      DialogProps.onClose?.({}, 'backdropClick');
    },
  });
  const { mutateAsync: updateAdminProfile } = trpc.protectedDashboardUser.update.useMutation({
    onError: (err) => showError(err.message),
    onSuccess: () => {
      showSuccess(t('user:Profile.Updated'));
      updateSession();
      DialogProps.onClose?.({}, 'backdropClick');
    },
  });

  const onSubmit = useCallback(
    async (data: UserUpdateProfileInputSchema) => {
      if (isUser) {
        await updateUserProfile({
          nickname: data.nickname ?? null,
          email: data.email ?? null,
          avatar: data.avatar ?? null,
          bio: data.bio ?? null,
        }).catch(() => null);
      }
      if (isAdmin) {
        await updateAdminProfile({
          nickname: data.nickname ?? null,
          email: data.email ?? null,
          avatar: data.avatar ?? null,
          bio: data.bio ?? null,
        }).catch(() => null);
      }
    },
    [isUser, isAdmin, updateUserProfile, updateAdminProfile],
  );

  const [avatarSrc, setAvatarSrc] = useDebounceValue(session?.user?.avatar, 1500);

  useEffect(() => {
    setAvatarSrc(watch('avatar'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('avatar'), setAvatarSrc]);

  const onClose = useCallback(() => {
    if (session?.user) reset(session.user, { keepDefaultValues: false });
    DialogProps?.onClose?.({}, 'backdropClick');
  }, [reset, DialogProps, session]);

  return (
    <Dialog onClose={onClose} {...DialogProps}>
      <AppBar elevation={0} {...overrides?.AppBarProps}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Typography variant="subtitle1">{t('user:Profile.Update')}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton edge="end" onClick={onClose} disabled={status === 'loading'} color="inherit">
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
            {getValues('nickname')?.charAt(0) ?? FallbackString}
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
              label={t('user:Profile.Avatar')}
              placeholder={t('user:Profile.Avatar')}
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
              label={t('user:Profile.Nickname')}
              placeholder={t('user:Profile.Nickname')}
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
              label={t('user:Profile.Email')}
              placeholder={t('user:Profile.Email')}
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
              label={t('user:Profile.Bio')}
              placeholder={t('user:Profile.Bio')}
              multiline
              maxRows={3}
            />
          )}
        />
      </DialogContent>
      <DialogActions {...overrides?.DialogActionsProps}>
        <Box sx={{ flexGrow: 1 }} />
        <LoadingButton
          loading={status === 'loading'}
          disabled={!isAdmin && !isUser}
          onClick={() => handleSubmit(onSubmit)()}
        >
          {t('common:Submit')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
