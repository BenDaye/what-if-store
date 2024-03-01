import { AuthProps, useNotice } from '@/hooks';
import { SignInSchema, signInSchema } from '@/server/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Close as CloseIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  AppBar,
  Box,
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
import { signIn, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useBoolean } from 'usehooks-ts';
import { SignUpButton } from './SignUpButton';

type SignInDialogProps = DialogProps & AuthProps;

export const SignInDialog = ({
  role,
  enableSignIn,
  enableSignUp,
  ...props
}: SignInDialogProps) => {
  const { showError, showSuccess, showWarning } = useNotice();
  const { status } = useSession();
  const { t: tAuth } = useTranslation('auth');
  const { handleSubmit, control, reset } = useForm<SignInSchema>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  });
  const { value: showPassword, toggle: toggleShowPassword } = useBoolean(false);
  const onSubmit = useCallback(
    async (data: SignInSchema) => {
      if (!enableSignIn) {
        showWarning(tAuth('SignIn.Disabled'));
        return;
      }
      try {
        const result =
          role === AuthRole.USER
            ? await signIn('credentials-user', {
                ...data,
                redirect: false,
              })
            : role === AuthRole.ADMIN
              ? await signIn('credentials-admin', { ...data, redirect: false })
              : { error: 'Unknown Auth Role' };
        if (result?.error) {
          throw new Error(result.error);
        }
        showSuccess(tAuth('SignIn.Succeeded'), {
          autoHideDuration: 1000,
          onClose: () => {
            if (typeof window !== 'undefined') window.location.reload();
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          showError(tAuth(error.message));
        }
        console.error(error);
      } finally {
        reset();
      }
    },
    [reset, role, showError, showSuccess, showWarning, tAuth, enableSignIn],
  );

  return (
    <>
      <Dialog
        {...props}
        onClose={(ev, reason) => {
          reset();
          props?.onClose?.(ev, reason);
        }}
      >
        <AppBar position="static" enableColorOnDark elevation={0}>
          <Toolbar variant="dense" sx={{ gap: 1 }}>
            <Typography variant="subtitle1" color="text.primary">
              {tAuth('SignIn._')}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              edge="end"
              onClick={() => {
                reset();
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
            name="username"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                variant="filled"
                value={value}
                onChange={onChange}
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                margin="normal"
                label={tAuth('Account')}
                placeholder={tAuth('Account')}
                autoFocus
                required
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                value={value}
                variant="filled"
                onChange={onChange}
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                label={tAuth('Password')}
                placeholder={tAuth('Password')}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="Toggle Password visibility"
                      onClick={toggleShowPassword}
                      onMouseDown={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <Visibility color="primary" />
                      ) : (
                        <VisibilityOff color="inherit" />
                      )}
                    </IconButton>
                  ),
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ gap: 1 }}>
          {enableSignUp && (
            <SignUpButton color="info" onClick={() => reset()} />
          )}
          <Box sx={{ flexGrow: 1 }}></Box>
          <LoadingButton
            loading={status === 'loading'}
            disabled={status === 'loading'}
            onClick={() => handleSubmit(onSubmit)()}
          >
            {tAuth('SignIn._')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
