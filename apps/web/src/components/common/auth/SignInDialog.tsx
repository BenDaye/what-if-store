import type { AuthProps } from '@/hooks';
import { useNotice } from '@/hooks';
import type { OverridesDialogProps } from '@/types/overrides';
import { zodResolver } from '@hookform/resolvers/zod';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';
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
import { getSession, signIn, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useBoolean } from 'usehooks-ts';
import { AuthRole } from '@what-if-store/prisma/client';
import { resetTRPCClient } from '@what-if-store/server/next/trpc';
import type { SignInSchema } from '@what-if-store/server/server/schemas/auth';
import { signInSchema } from '@what-if-store/server/server/schemas/auth';
import { SignUpButton } from './SignUpButton';

type SignInDialogProps = OverridesDialogProps & AuthProps;

export const SignInDialog = ({ disableSignIn, disableSignUp, overrides, DialogProps }: SignInDialogProps) => {
  const { query, pathname, push } = useRouter();
  const { showError, showSuccess, showWarning } = useNotice();
  const { status, update: updateSession } = useSession();
  const { t } = useTranslation();
  const { handleSubmit, control, reset } = useForm<SignInSchema>({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'all',
    resolver: zodResolver(signInSchema),
  });
  const { value: showPassword, toggle: toggleShowPassword } = useBoolean(false);
  const onSubmit = useCallback(
    async (data: SignInSchema) => {
      if (disableSignIn) {
        showWarning(t('auth:SignIn.Disabled'));
        return;
      }
      try {
        const result = await signIn('credentials', {
          ...data,
          redirect: false,
        });
        if (result?.error) {
          throw new Error(result.error);
        }
        await updateSession();
        resetTRPCClient();
        showSuccess(t('auth:SignIn.Succeeded'), {
          autoHideDuration: 1000,
          onClose: async () => {
            const _session = await getSession();
            if (_session?.user?.role === AuthRole.Admin && !pathname.startsWith('/dashboard')) {
              push('/dashboard');
              return;
            }
          },
        });
        DialogProps?.onClose?.({}, 'backdropClick');
      } catch (error) {
        showError(t('auth:SignIn.Failed'));
        console.error(error);
      } finally {
        reset();
      }
    },
    [
      disableSignIn,
      showWarning,
      t,
      updateSession,
      showSuccess,
      DialogProps,
      pathname,
      push,
      showError,
      reset,
    ],
  );

  useEffect(() => {
    const { error: nextAuthError } = query;
    if (!nextAuthError) return;
    if (typeof nextAuthError === 'string') showError(t(`errorMessage:${nextAuthError}`));
    if (Array.isArray(nextAuthError)) nextAuthError.forEach((err) => showError(t(`errorMessage:${err}`)));
  }, [query, showError, t]);

  const onClose = useCallback(() => {
    reset();
    DialogProps.onClose?.({}, 'backdropClick');
  }, [reset, DialogProps]);

  return (
    <>
      <Dialog onClose={onClose} {...DialogProps}>
        <AppBar elevation={0} {...overrides?.AppBarProps}>
          <Toolbar variant="dense" sx={{ gap: 1 }}>
            <Typography variant="subtitle1">
              {t('auth:SignIn._')}
              {disableSignIn && ` (${t('auth:SignIn.Disabled')})`}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            {!pathname.startsWith('/auth/signin') && (
              <IconButton edge="end" onClick={onClose} disabled={status === 'loading'} color="inherit">
                <CloseIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        <DialogContent {...overrides?.DialogContentProps}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error?.message ?? ' '}
                label={t('auth:Account')}
                placeholder={t('auth:Account')}
                autoFocus
                required
                disabled={disableSignIn}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error?.message ?? ' '}
                type={showPassword ? 'text' : 'password'}
                label={t('auth:Password')}
                placeholder={t('auth:Password')}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? <Visibility color="primary" /> : <VisibilityOff color="inherit" />}
                    </IconButton>
                  ),
                }}
                disabled={disableSignIn}
              />
            )}
          />
        </DialogContent>
        <DialogActions {...overrides?.DialogActionsProps}>
          <SignUpButton color="secondary" onClick={() => reset()} disabled={disableSignUp} />
          <Box sx={{ flexGrow: 1 }} />
          <LoadingButton
            loading={status === 'loading'}
            disabled={status === 'loading'}
            onClick={() => handleSubmit(onSubmit)()}
          >
            {t('auth:SignIn._')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
