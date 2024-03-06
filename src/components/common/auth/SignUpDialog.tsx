import { AuthProps, useAuth, useNotice } from '@/hooks';
import { signUpSchema } from '@/server/schemas/auth';
import { trpc } from '@/utils/trpc';
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
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useBoolean } from 'usehooks-ts';
import { z } from 'zod';
import { SignInButton } from './SignInButton';

type SignUpDialogProps = DialogProps & AuthProps;

const signUpForm = signUpSchema
  .extend({
    confirmPassword: signUpSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type SignUpForm = z.infer<typeof signUpForm>;

export const SignUpDialog = ({
  disableSignIn,
  disableSignUp,
  ...props
}: SignUpDialogProps) => {
  const { signIn } = useAuth();
  const { showError, showSuccess, showWarning } = useNotice();
  const { status } = useSession();
  const { t: tAuth } = useTranslation('auth');
  const { handleSubmit, control, reset } = useForm<SignUpForm>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(signUpForm),
  });
  const { value: showPassword, toggle: toggleShowPassword } = useBoolean(false);
  const { mutateAsync: signUp } = trpc.publicAppAuth.signUp.useMutation({
    onError: (err) => showError(err.message),
    onSuccess: () => {
      showSuccess(tAuth('SignUp.Succeeded'));
      reset();
      props.onClose?.({}, 'backdropClick');
      signIn();
    },
  });

  const onSubmit = useCallback(
    async (data: SignUpForm) => {
      if (disableSignUp) {
        showWarning(tAuth('SignUp.Disabled'));
        return;
      }
      await signUp(data).catch(() => null);
    },
    [disableSignUp, signUp, showWarning, tAuth],
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
            <Typography variant="subtitle1">
              {tAuth('SignUp._')}
              {disableSignUp && ` (${tAuth('SignUp.Disabled')})`}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              edge="end"
              onClick={() => {
                reset();
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
                disabled={disableSignUp}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label={tAuth('Password')}
                value={value}
                variant="filled"
                onChange={onChange}
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                placeholder={tAuth('Password')}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="Toggle Password visibility"
                      onClick={toggleShowPassword}
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
                disabled={disableSignUp}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label={tAuth('ConfirmPassword')}
                value={value}
                variant="filled"
                onChange={onChange}
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                placeholder={tAuth('Confirm Password')}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="Toggle Password visibility"
                      onClick={toggleShowPassword}
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
                disabled={disableSignUp}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <SignInButton
            color="secondary"
            onClick={() => reset()}
            disabled={disableSignIn}
          />
          <Box sx={{ flexGrow: 1 }}></Box>
          <LoadingButton
            loading={status === 'loading'}
            disabled={status === 'loading'}
            onClick={() => handleSubmit(onSubmit)()}
          >
            {tAuth('SignUp._')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
