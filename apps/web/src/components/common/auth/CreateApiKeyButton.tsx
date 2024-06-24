import { useCopy, useNotice } from '@/hooks';
import type { OverridesButtonProps, OverridesDialogProps } from '@/types/overrides';
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
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useBoolean } from 'usehooks-ts';
import { AuthRole } from '@what-if-store/prisma/client';
import { trpc } from '@what-if-store/server/react/trpc';
import type { UserApiKeyCreateInputSchema } from '@what-if-store/server/server/schemas';
import { userApiKeyCreateInputSchema } from '@what-if-store/server/server/schemas';

type CreateApiKeyButtonProps = OverridesButtonProps;
export const CreateApiKeyButton = ({ overrides }: CreateApiKeyButtonProps) => {
  const { t } = useTranslation();
  const {
    value: apiKeyDialogVisible,
    setTrue: openApiKeyDialog,
    setFalse: closeApiKeyDialog,
  } = useBoolean(false);
  return (
    <>
      <Button onClick={openApiKeyDialog} disabled={apiKeyDialogVisible} {...overrides?.ButtonProps}>
        {t('auth:ApiKey.Create')}
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

export const CreateApiKeyDialog = ({ overrides, DialogProps }: OverridesDialogProps) => {
  const { showError, showSuccess } = useNotice();
  const { t } = useTranslation();

  const { data: session } = useSession();
  const isUser = useMemo(
    () => session?.user?.role === AuthRole.User || session?.user?.role === AuthRole.Provider,
    [session?.user?.role],
  );
  const isAdmin = useMemo(() => session?.user?.role === AuthRole.Admin, [session?.user?.role]);

  const { handleSubmit, control, reset } = useForm<UserApiKeyCreateInputSchema>({
    defaultValues: {
      remark: '',
    },
    mode: 'all',
    resolver: zodResolver(userApiKeyCreateInputSchema),
  });

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
      showSuccess(t('auth:ApiKey.Created'), { onClose: () => copy(res.key) });
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
      showSuccess(t('auth:ApiKey.Created'), { onClose: () => copy(res.key) });
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
          <Typography variant="subtitle1">{t('auth:ApiKey.Create')}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton edge="end" onClick={onClose} disabled={isUserPending || isAdminPending} color="inherit">
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
              {t('auth:ApiKey.SaveThisKey')}
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
              {t('auth:ApiKey.SaveThisKey')}
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
                label={t('auth:ApiKey.Remark')}
                placeholder={t('auth:ApiKey.Remark')}
                autoFocus
              />
            )}
          />
        )}
      </DialogContent>
      <DialogActions {...overrides?.DialogActionsProps}>
        <Box sx={{ flexGrow: 1 }} />
        {isAdminSuccess ? (
          <Button color="success" onClick={() => copy(adminData.key)}>
            {t('common:Copy')}
          </Button>
        ) : isUserSuccess ? (
          <Button color="success" onClick={() => copy(userData.key)}>
            {t('common:Copy')}
          </Button>
        ) : (
          <LoadingButton
            loading={isUserPending || isAdminPending}
            disabled={!isUser && !isAdmin}
            onClick={() => handleSubmit(onSubmit)()}
          >
            {t('common:Submit')}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
};
