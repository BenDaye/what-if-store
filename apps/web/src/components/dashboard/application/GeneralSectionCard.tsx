import type { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { useNotice } from '@/hooks';
import type { ApplicationUpdateInputSchema } from '@/server/schemas';
import { applicationUpdateInputSchema } from '@/server/schemas';
import type { OverridesCardProps } from '@/types/overrides';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, CardActions, CardContent, CardHeader, MenuItem, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { ApplicationCategory } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { trpc } from '@what-if-store/server/react/trpc';

type GeneralSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const GeneralSectionCard = ({ overrides, defaultValues }: GeneralSectionCardProps) => {
  const { t } = useTranslation();
  const { handleSubmit, reset, control, formState } = useForm<ApplicationUpdateInputSchema>({
    defaultValues,
    mode: 'all',
    resolver: zodResolver(applicationUpdateInputSchema),
  });

  useEffect(() => {
    if (!defaultValues) return;
    reset(defaultValues, { keepDefaultValues: false });
  }, [defaultValues, reset]);

  const { showSuccess, showError } = useNotice();
  const { mutateAsync: update, isPending } = trpc.protectedDashboardApplication.updateById.useMutation({
    onError: (err) => showError(err.message),
    onSuccess: () => showSuccess(t('common:Updated')),
  });

  const onSubmit = async (data: ApplicationUpdateInputSchema) => await update(data).catch(() => null);

  useEffect(() => {
    if (!window) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (formState.isDirty) {
        event.preventDefault();
        event.returnValue = t('common:UnsavedFormAlert');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formState, t]);

  return (
    <Card
      variant="outlined"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        borderColor: formState.isDirty ? 'primary.main' : 'divider',
      }}
      {...overrides?.CardProps}
    >
      <CardHeader title={t('application:General._')} {...overrides?.CardHeaderProps} />
      <CardContent {...overrides?.CardContentProps}>
        <Grid container spacing={1}>
          <Grid md={12} xl={6}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={t('application:General.Name')}
                  placeholder={t('application:General.Name')}
                  required
                  helperText={error?.message ?? ' '}
                  disabled={isPending}
                />
              )}
            />
          </Grid>
          <Grid md={12} xl={6}>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={t('application:Category._')}
                  placeholder={t('application:Category._')}
                  required
                  helperText={error?.message ?? ' '}
                  disabled={isPending}
                  select
                >
                  {Object.values(ApplicationCategory).map((category) => (
                    <MenuItem key={category} value={category}>
                      {t(`application:Category.Name.${category}`)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid xs={12}>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={t('application:General.Description')}
                  placeholder={t('application:General.Description')}
                  required
                  helperText={error?.message ?? ' '}
                  disabled={isPending}
                  multiline
                  minRows={4}
                  maxRows={8}
                />
              )}
            />
          </Grid>
          <Grid md={12} xl={6}>
            <Controller
              control={control}
              name="website"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={t('application:General.Website')}
                  placeholder={t('application:General.Website')}
                  helperText={error?.message ?? ' '}
                  disabled={isPending}
                />
              )}
            />
          </Grid>
          <Grid md={12} xl={6}>
            <Controller
              control={control}
              name="github"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={t('application:General.Github')}
                  placeholder={t('application:General.Github')}
                  helperText={error?.message ?? ' '}
                  disabled={isPending}
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions {...overrides?.CardActionsProps}>
        <Box flexGrow={1} />
        <Button
          size="small"
          color="error"
          onClick={() => reset(defaultValues, { keepDefaultValues: false })}
          disabled={isPending || !formState.isDirty}
        >
          {t('common:Reset')}
        </Button>
        <LoadingButton
          size="small"
          color="primary"
          type="submit"
          disabled={!formState.isDirty}
          loading={isPending}
        >
          {t('common:Submit')}
        </LoadingButton>
      </CardActions>
    </Card>
  );
};
