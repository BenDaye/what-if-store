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
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CountriesAutoComplete } from './CountriesAutoComplete';
import { LocalesAutoComplete } from './LocaleAutoComplete';
import { TagsAutoComplete } from './TagsAutoComplete';

type CompatibilitySectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const CompatibilitySectionCard = ({
  overrides,
  defaultValues,
}: CompatibilitySectionCardProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tApplication } = useTranslation('application', {
    keyPrefix: 'General',
  });
  const { handleSubmit, reset, control, formState, setValue } =
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
        title={tApplication('Extra', 'Extra')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <Grid container spacing={1}>
          <Grid xs={12}>
            <CountriesAutoComplete
              onChange={(value) =>
                setValue('countries', value, { shouldDirty: true })
              }
              defaultValue={defaultValues.countries}
              error={formState.errors.countries}
              disabled={isPending}
            />
            <Controller
              control={control}
              name="countries"
              render={() => <Box />}
            />
          </Grid>
          <Grid xs={12}>
            <LocalesAutoComplete
              onChange={(value) =>
                setValue('locales', value, { shouldDirty: true })
              }
              defaultValue={defaultValues.locales}
              error={formState.errors.locales}
              disabled={isPending}
            />
            <Controller
              control={control}
              name="locales"
              render={() => <Box />}
            />
          </Grid>
          <Grid xs={12}>
            <TagsAutoComplete
              onChange={(value) =>
                setValue('tags', value, { shouldDirty: true })
              }
              defaultValue={defaultValues.tags}
              error={formState.errors.tags}
              disabled={isPending}
            />
            <Controller control={control} name="tags" render={() => <Box />} />
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
