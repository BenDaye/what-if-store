import { UseDashboardApplicationHookDataSchema, useNotice } from '@/hooks';
import { ApplicationUpdateInputSchema } from '@/server/schemas';
import { OverridesCardProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  MenuItem,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { ApplicationCategory } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

type GeneralSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const GeneralSectionCard = ({
  overrides,
  defaultValues,
}: GeneralSectionCardProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tApplicationGeneral } = useTranslation('application', {
    keyPrefix: 'General',
  });
  const { t: tApplicationCategory } = useTranslation('application', {
    keyPrefix: 'Category',
  });
  const { handleSubmit, reset, control, formState } =
    useForm<ApplicationUpdateInputSchema>({
      defaultValues,
      mode: 'all',
    });

  useEffect(() => {
    if (!defaultValues) return;
    reset(defaultValues, { keepDefaultValues: false });
  }, [defaultValues, reset]);

  const { showSuccess, showError } = useNotice();
  const { mutateAsync: update, isPending } =
    trpc.protectedDashboardApplication.updateById.useMutation({
      onError: (err) => showError(err.message),
      onSuccess: () => showSuccess(tCommon('Updated', 'Updated')),
    });

  const onSubmit = async (data: ApplicationUpdateInputSchema) =>
    await update(data).catch(() => null);

  useEffect(() => {
    if (!window) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (formState.isDirty) {
        event.preventDefault();
        event.returnValue = tCommon(
          'UnsavedFormAlert',
          'Unsaved changes will be lost.',
        );
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formState, tCommon]);

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
      <CardHeader
        title={tApplicationGeneral('_', 'General')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <Grid container spacing={1}>
          <Grid md={12} xl={6}>
            <Controller
              control={control}
              name="name"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={tApplicationGeneral('Name', 'Name')}
                  placeholder={tApplicationGeneral('Name', 'Name')}
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
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={tApplicationGeneral('Category', 'Category')}
                  placeholder={tApplicationGeneral('Category', 'Category')}
                  required
                  helperText={error?.message ?? ' '}
                  disabled={isPending}
                  select
                >
                  {Object.values(ApplicationCategory).map((category) => (
                    <MenuItem key={category} value={category}>
                      {tApplicationCategory(category, category)}
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
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={tApplicationGeneral('Description', 'Description')}
                  placeholder={tApplicationGeneral(
                    'Description',
                    'Description',
                  )}
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
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={tApplicationGeneral('Website', 'Home Page')}
                  placeholder={tApplicationGeneral('Website', 'Home Page')}
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
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={tApplicationGeneral('Github', 'Github')}
                  placeholder={tApplicationGeneral('Github', 'Github')}
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
          {tCommon('Reset', 'Reset')}
        </Button>
        <LoadingButton
          size="small"
          color="primary"
          type="submit"
          disabled={!formState.isDirty}
          loading={isPending}
        >
          {tCommon('Submit', 'Submit')}
        </LoadingButton>
      </CardActions>
    </Card>
  );
};
