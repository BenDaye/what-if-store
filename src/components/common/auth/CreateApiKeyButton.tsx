import { useCopy, useNotice } from '@/hooks';
import {
  UserApiKeyCreateInputSchema,
  userApiKeyCreateInputSchema,
} from '@/server/schemas';
import { OverridesButtonProps, OverridesDialogProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { Close as CloseIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  AppBar,
  Box,
  Button,
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
import { useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useBoolean } from 'usehooks-ts';

type CreateApiKeyButtonProps = OverridesButtonProps;
export const CreateApiKeyButton = ({ overrides }: CreateApiKeyButtonProps) => {
  const { t: tAuthApiKey } = useTranslation('auth', { keyPrefix: 'ApiKey' });
  const {
    value: apiKeyDialogVisible,
    setTrue: openApiKeyDialog,
    setFalse: closeApiKeyDialog,
  } = useBoolean(false);
  return (
    <>
      <Button
        onClick={openApiKeyDialog}
        disabled={apiKeyDialogVisible}
        {...overrides?.ButtonProps}
      >
        {tAuthApiKey('Create', 'Create API Key')}
      </Button>
      <CreateApiKeyDialog
        DialogProps={{
          open: apiKeyDialogVisible,
          onClose: closeApiKeyDialog,
        }}
      />
    </>
  );
};

export const CreateApiKeyDialog = ({
  overrides,
  DialogProps,
}: OverridesDialogProps) => {
  const { showError, showSuccess } = useNotice();
  const { t: tCommon } = useTranslation('common');
  const { t: tAuthApiKey } = useTranslation('auth', { keyPrefix: 'ApiKey' });

  const { data: session } = useSession();
  const isUser = useMemo(
    () =>
      session?.user?.role === AuthRole.User ||
      session?.user?.role === AuthRole.Provider,
    [session?.user?.role],
  );
  const isAdmin = useMemo(
    () => session?.user?.role === AuthRole.Admin,
    [session?.user?.role],
  );

  const { handleSubmit, control, reset } = useForm<UserApiKeyCreateInputSchema>(
    {
      defaultValues: {
        remark: '',
      },
      mode: 'all',
      resolver: zodResolver(userApiKeyCreateInputSchema),
    },
  );

  const copy = useCopy();

  const {
    mutateAsync: createUserApiKey,
    isPending: isUserPending,
    data: userData,
    isSuccess: isUserSuccess,
    reset: resetUser,
  } = trpc.protectedAppUserApiKey.create.useMutation({
    onError: (err) => showError(err.message),
    onSuccess: (res) => {
      showSuccess(tCommon('Created'), { onClose: () => copy(res.key) });
    },
  });

  const {
    mutateAsync: createAdminApiKey,
    isPending: isAdminPending,
    data: adminData,
    isSuccess: isAdminSuccess,
    reset: resetAdmin,
  } = trpc.protectedDashboardUserApiKey.create.useMutation({
    onError: (err) => showError(err.message),
    onSuccess: (res) => {
      showSuccess(tCommon('Created'), { onClose: () => copy(res.key) });
    },
  });

  const onSubmit = useCallback(
    async (data: UserApiKeyCreateInputSchema) => {
      if (isUser) {
        await createUserApiKey(data).catch(() => null);
      }
      if (isAdmin) {
        await createAdminApiKey(data).catch(() => null);
      }
    },
    [isUser, isAdmin, createUserApiKey, createAdminApiKey],
  );

  const onClose = useCallback(() => {
    reset();
    resetAdmin();
    resetUser();
    DialogProps?.onClose?.({}, 'backdropClick');
  }, [reset, DialogProps, resetAdmin, resetUser]);
  return (
    <Dialog onClose={onClose} {...DialogProps}>
      <AppBar elevation={0} {...overrides?.AppBarProps}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Typography variant="subtitle1">
            {tAuthApiKey('Create', 'Create API Key')}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            edge="end"
            onClick={onClose}
            disabled={isUserPending || isAdminPending}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent {...overrides?.DialogContentProps}>
        {isAdminSuccess ? (
          <>
            <Typography
              variant="subtitle1"
              color="error"
              gutterBottom
              sx={{
                fontFamily: 'Roboto Mono',
                fontWeight: (theme) => theme.typography.fontWeightBold,
                textAlign: 'center',
              }}
            >
              {adminData.key}
            </Typography>
            <Typography variant="caption" color="error">
              {tAuthApiKey('SaveThisKey')}
            </Typography>
          </>
        ) : isUserSuccess ? (
          <>
            <Typography
              variant="subtitle1"
              color="error"
              gutterBottom
              sx={{
                fontFamily: 'Roboto Mono',
                fontWeight: (theme) => theme.typography.fontWeightBold,
                textAlign: 'center',
              }}
            >
              {userData.key}
            </Typography>
            <Typography variant="caption" color="error">
              {tAuthApiKey('SaveThisKey')}
            </Typography>
          </>
        ) : (
          <Controller
            control={control}
            name="remark"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error?.message ?? ' '}
                label={tAuthApiKey('Remark')}
                placeholder={tAuthApiKey('Remark')}
                autoFocus
              />
            )}
          />
        )}
      </DialogContent>
      <DialogActions {...overrides?.DialogActionsProps}>
        <Box sx={{ flexGrow: 1 }}></Box>
        {isAdminSuccess ? (
          <Button color="success" onClick={() => copy(adminData.key)}>
            {tCommon('Copy')}
          </Button>
        ) : isUserSuccess ? (
          <Button color="success" onClick={() => copy(userData.key)}>
            {tCommon('Copy')}
          </Button>
        ) : (
          <LoadingButton
            loading={isUserPending || isAdminPending}
            disabled={!isUser && !isAdmin}
            onClick={() => handleSubmit(onSubmit)()}
          >
            {tCommon('Submit')}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
};
