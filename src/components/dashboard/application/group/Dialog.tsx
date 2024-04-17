import { UseDashboardApplicationGroupHookDataSchema, useNotice } from '@/hooks';
import {
  ApplicationGroupCreateInputSchema,
  ApplicationGroupUpdateInputSchema,
  applicationGroupCreateInputSchema,
  applicationGroupUpdateInputSchema,
} from '@/server/schemas';
import { OverridesDialogProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { Close as CloseIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  AppBar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { ApplicationGroupType } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ApplicationsAutoComplete } from '../ApplicationsAutoComplete';

type ApplicationGroupDialogProps = OverridesDialogProps & {
  defaultValues?: UseDashboardApplicationGroupHookDataSchema;
  mutationType?: 'update' | 'create';
};

export const ApplicationGroupDialog = ({
  overrides,
  DialogProps,
  defaultValues,
  mutationType = 'create',
}: ApplicationGroupDialogProps) => {
  return mutationType === 'update' ? (
    <UpdateApplicationGroupDialog
      overrides={overrides}
      DialogProps={DialogProps}
      defaultValues={defaultValues}
    />
  ) : (
    <CreateApplicationGroupDialog
      overrides={overrides}
      DialogProps={DialogProps}
    />
  );
};

export const UpdateApplicationGroupDialog = ({
  overrides,
  DialogProps,
  defaultValues,
}: ApplicationGroupDialogProps) => {
  const { t } = useTranslation();

  const { handleSubmit, control, reset, setValue, formState } =
    useForm<ApplicationGroupUpdateInputSchema>({
      defaultValues,
      mode: 'all',
      resolver: zodResolver(applicationGroupUpdateInputSchema),
    });

  useEffect(() => {
    reset(defaultValues, { keepDefaultValues: false });
  }, [reset, defaultValues]);

  const { showError, showSuccess } = useNotice();
  const { mutateAsync: update, isPending } =
    trpc.protectedDashboardApplicationGroup.updateById.useMutation({
      onError: (err) => showError(err.message),
      onSuccess: () => {
        showSuccess(t('common:Updated'));
        DialogProps.onClose?.({}, 'backdropClick');
      },
    });

  const onSubmit = useCallback(
    async (data: ApplicationGroupUpdateInputSchema) => {
      await update(data).catch(() => null);
    },
    [update],
  );

  const onClose = useCallback(() => {
    reset();
    DialogProps?.onClose?.({}, 'backdropClick');
  }, [reset, DialogProps]);

  return (
    <Dialog onClose={onClose} {...DialogProps}>
      <AppBar elevation={0} {...overrides?.AppBarProps}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Typography variant="subtitle1">{t('common:Update')}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            edge="end"
            onClick={onClose}
            disabled={isPending}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent {...overrides?.DialogContentProps}>
        <Controller
          control={control}
          name="name"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <TextField
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              helperText={error?.message ?? ' '}
              label={t('application:Group.Form.Name')}
              placeholder={t('application:Group.Form.Name')}
              required
              disabled={isPending}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <TextField
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              helperText={error?.message ?? ' '}
              label={t('application:Group.Form.Description')}
              placeholder={t('application:Group.Form.Description')}
              disabled={isPending}
            />
          )}
        />
        <Controller
          control={control}
          name="type"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <TextField
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              helperText={error?.message ?? ' '}
              label={t('application:Group.Form.Type')}
              placeholder={t('application:Group.Form.Type')}
              required
              select
              disabled={isPending}
            >
              {Object.values(ApplicationGroupType).map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`application:Group.Type.${type}`, type)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="priority"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <TextField
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              helperText={error?.message ?? ' '}
              label={t('application:Group.Form.Priority')}
              placeholder={t('application:Group.Form.Priority')}
              type="number"
              required
              disabled={isPending}
            />
          )}
        />
        <ApplicationsAutoComplete
          onChange={(value) =>
            setValue('applications', value, { shouldDirty: true })
          }
          defaultValue={defaultValues?.applications}
          error={formState.errors.applications}
          disabled={isPending}
        />
        <Controller
          control={control}
          name="applications"
          render={() => <Box />}
        />
      </DialogContent>
      <DialogActions {...overrides?.DialogActionsProps}>
        <Box sx={{ flexGrow: 1 }}></Box>
        <LoadingButton
          loading={isPending}
          onClick={() => handleSubmit(onSubmit)()}
        >
          {t('common:Submit')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export const CreateApplicationGroupDialog = ({
  overrides,
  DialogProps,
  defaultValues = {
    name: '',
    description: '',
    type: ApplicationGroupType.Temporary,
    priority: 0,
    applications: [],
  },
}: Omit<ApplicationGroupDialogProps, 'defaultValues'> & {
  defaultValues?: ApplicationGroupCreateInputSchema;
}) => {
  const { t } = useTranslation();

  const { handleSubmit, control, reset, setValue, formState } =
    useForm<ApplicationGroupCreateInputSchema>({
      defaultValues,
      mode: 'all',
      resolver: zodResolver(applicationGroupCreateInputSchema),
    });

  const { showError, showSuccess } = useNotice();
  const { mutateAsync: create, isPending } =
    trpc.protectedDashboardApplicationGroup.create.useMutation({
      onError: (err) => showError(err.message),
      onSuccess: () => {
        showSuccess(t('common:Created'));
        DialogProps.onClose?.({}, 'backdropClick');
      },
    });

  const onSubmit = useCallback(
    async (data: ApplicationGroupCreateInputSchema) => {
      await create(data).catch(() => null);
    },
    [create],
  );

  const onClose = useCallback(() => {
    reset();
    DialogProps?.onClose?.({}, 'backdropClick');
  }, [reset, DialogProps]);

  return (
    <Dialog onClose={onClose} {...DialogProps}>
      <AppBar elevation={0} {...overrides?.AppBarProps}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Typography variant="subtitle1">{t('common:Create')}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            edge="end"
            onClick={onClose}
            disabled={isPending}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent {...overrides?.DialogContentProps}>
        {' '}
        <Controller
          control={control}
          name="name"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <TextField
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              helperText={error?.message ?? ' '}
              label={t('application:Group.Form.Name')}
              placeholder={t('application:Group.Form.Name')}
              required
              disabled={isPending}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <TextField
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              helperText={error?.message ?? ' '}
              label={t('application:Group.Form.Description')}
              placeholder={t('application:Group.Form.Description')}
              disabled={isPending}
            />
          )}
        />
        <Controller
          control={control}
          name="type"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <TextField
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              helperText={error?.message ?? ' '}
              label={t('application:Group.Form.Type')}
              placeholder={t('application:Group.Form.Type')}
              required
              select
              disabled={isPending}
            >
              {Object.values(ApplicationGroupType).map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`application:Group.Type.${type}`, type)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          control={control}
          name="priority"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <TextField
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              helperText={error?.message ?? ' '}
              label={t('application:Group.Form.Priority')}
              placeholder={t('application:Group.Form.Priority')}
              type="number"
              required
              disabled={isPending}
            />
          )}
        />
        <ApplicationsAutoComplete
          onChange={(value) =>
            setValue('applications', value, { shouldDirty: true })
          }
          defaultValue={defaultValues?.applications}
          error={formState.errors.applications}
          disabled={isPending}
        />
        <Controller
          control={control}
          name="applications"
          render={() => <Box />}
        />
      </DialogContent>
      <DialogActions {...overrides?.DialogActionsProps}>
        <Box sx={{ flexGrow: 1 }}></Box>
        <LoadingButton
          loading={isPending}
          onClick={() => handleSubmit(onSubmit)()}
        >
          {t('common:Submit')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
