import type { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { useNotice } from '@/hooks';
import type { OverridesCardProps } from '@/types/overrides';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ApplicationPlatform } from '@what-if-store/prisma/client';
import { trpc } from '@what-if-store/server/next/trpc';
import type { ApplicationUpdateInputSchema } from '@what-if-store/server/server/schemas';
import { applicationUpdateInputSchema } from '@what-if-store/server/server/schemas';

type CompatibilitySectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const CompatibilitySectionCard = ({ overrides, defaultValues }: CompatibilitySectionCardProps) => {
  const { t } = useTranslation();
  const { handleSubmit, reset, control, formState, setValue, getValues } =
    useForm<ApplicationUpdateInputSchema>({
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

  const [compatibility, setCompatibility] = useState<Record<ApplicationPlatform, string>>({
    Other: '',
    iOS: '',
    Android: '',
    Web: '',
    Mac: '',
    Windows: '',
    Linux: '',
  });

  useEffect(() => {
    if (!Array.isArray(defaultValues.compatibility)) return;
    const _compatibility: Record<ApplicationPlatform, string> = {
      Other: '',
      iOS: '',
      Android: '',
      Web: '',
      Mac: '',
      Windows: '',
      Linux: '',
    };
    for (const { platform, requirement } of defaultValues.compatibility) {
      _compatibility[platform] = requirement;
    }
    setCompatibility(_compatibility);
  }, [defaultValues]);

  useEffect(() => {
    setValue(
      'compatibility',
      Object.entries(compatibility)
        .map(([platform, requirement]) => ({
          platform: platform as ApplicationPlatform,
          requirement: requirement || platform,
        }))
        .filter(({ platform }) => getValues('platforms')?.includes(platform)),
      { shouldDirty: true },
    );
  }, [compatibility, setValue, getValues]);

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
      <CardHeader title={t('application:Declaration.Compatibility._')} {...overrides?.CardHeaderProps} />
      <CardContent component={List} {...overrides?.CardContentProps}>
        <Controller control={control} name="platforms" render={() => <Box />} />
        <Controller control={control} name="compatibility" render={() => <Box />} />
        {Object.values(ApplicationPlatform).map((platform) => (
          <ListItem key={platform}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={getValues('platforms')?.includes(platform)}
                onChange={(ev, checked) =>
                  setValue(
                    'platforms',
                    checked
                      ? getValues('platforms')?.concat([platform])
                      : getValues('platforms')?.filter((p) => p !== platform),
                    { shouldDirty: true },
                  )
                }
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <TextField
                  value={compatibility[platform]}
                  onChange={(ev) =>
                    setCompatibility({
                      ...compatibility,
                      [platform]: ev.target.value,
                    })
                  }
                  label={platform}
                  placeholder={t('application.Declaration.Compatibility.Requirement')}
                  disabled={!getValues('platforms')?.includes(platform)}
                  size="small"
                  multiline
                  maxRows={8}
                />
              }
            />
          </ListItem>
        ))}
        <ErrorMessage
          errors={formState.errors}
          name="platforms"
          render={({ messages }) =>
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <Typography variant="body2" color="error" key={type} paragraph>
                {message}
              </Typography>
            ))
          }
        />
        <ErrorMessage
          errors={formState.errors}
          name="compatibility"
          render={({ messages }) =>
            messages &&
            Object.entries(messages).map(([type, message]) => (
              <Typography variant="body2" color="error" key={type} paragraph>
                {message}
              </Typography>
            ))
          }
        />
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
