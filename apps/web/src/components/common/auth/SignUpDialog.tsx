import type { AuthProps } from '@/hooks';
import { useAuth, useNotice } from '@/hooks';
import { signUpSchema } from '@/server/schemas/auth';
import type { OverridesDialogProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
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
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useBoolean } from 'usehooks-ts';
import type { z } from 'zod';
import { SignInButton } from './SignInButton';

type SignUpDialogProps = OverridesDialogProps & AuthProps;

const signUpForm = signUpSchema
  .extend({
    confirmPassword: signUpSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type SignUpForm = z.infer<typeof signUpForm>;

export const SignUpDialog = ({ disableSignIn, disableSignUp, overrides, DialogProps }: SignUpDialogProps) => {
  const { signIn } = useAuth();
  const { showError, showSuccess, showWarning } = useNotice();
  const { status } = useSession();
  const { t } = useTranslation();
  const { handleSubmit, control, reset } = useForm<SignUpForm>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'all',
    resolver: zodResolver(signUpForm),
  });
  const { value: showPassword, toggle: toggleShowPassword } = useBoolean(false);
  const { mutateAsync: signUp } = trpc.publicAppAuth.signUp.useMutation({
    onError: (err) => showError(err.message),
    onSuccess: () => {
      showSuccess(t('auth:SignUp.Succeeded'));
      reset();
      DialogProps.onClose?.({}, 'backdropClick');
      signIn();
    },
  });

  const onSubmit = useCallback(
    async (data: SignUpForm) => {
      if (disableSignUp) {
        showWarning(t('auth:SignUp.Disabled'));
        return;
      }
      await signUp(data).catch(() => null);
    },
    [disableSignUp, signUp, showWarning, t],
  );

  const onClose = useCallback(() => {
    reset();
    DialogProps?.onClose?.({}, 'backdropClick');
  }, [reset, DialogProps]);

  return (
    <>
      <Dialog onClose={onClose} {...DialogProps}>
        <AppBar elevation={0} {...overrides?.AppBarProps}>
          <Toolbar variant="dense" sx={{ gap: 1 }}>
            <Typography variant="subtitle1">
              {t('auth:SignUp._')}
              {disableSignUp && ` (${t('auth:SignUp.Disabled')})`}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton edge="end" onClick={onClose} disabled={status === 'loading'} color="inherit">
              <CloseIcon />
            </IconButton>
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
                disabled={disableSignUp}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label={t('auth:Password')}
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error?.message ?? ' '}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth:Password')}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? <Visibility color="primary" /> : <VisibilityOff color="inherit" />}
                    </IconButton>
                  ),
                }}
                disabled={disableSignUp}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label={t('auth:ConfirmPassword')}
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error?.message ?? ' '}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth:ConfirmPassword')}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? <Visibility color="primary" /> : <VisibilityOff color="inherit" />}
                    </IconButton>
                  ),
                }}
                disabled={disableSignUp}
              />
            )}
          />
        </DialogContent>
        <DialogActions {...overrides?.DialogActionsProps}>
          <SignInButton color="secondary" onClick={() => reset()} disabled={disableSignIn} />
          <Box sx={{ flexGrow: 1 }} />
          <LoadingButton
            loading={status === 'loading'}
            disabled={status === 'loading'}
            onClick={() => handleSubmit(onSubmit)()}
          >
            {t('auth:SignUp._')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
