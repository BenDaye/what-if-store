import { UseDashboardApplicationHookDataSchema, useNotice } from '@/hooks';
import { ApplicationUpdateInputSchema } from '@/server/schemas';
import { OverridesCardProps } from '@/types/overrides';
import { shimmerSvg } from '@/utils/shimmer';
import { trpc } from '@/utils/trpc';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type IconSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const IconSectionCard = ({
  overrides,
  defaultValues,
}: IconSectionCardProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tApplication } = useTranslation('application', {
    keyPrefix: 'Media',
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
        title={tApplication('Icons', 'Icons')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <ImageList cols={5}>
          {defaultValues.icons.map((item) => (
            <ImageListItem key={item.id}>
              <Image
                alt="icon"
                src={item.url}
                width={128}
                height={128}
                placeholder={shimmerSvg(128, 128)}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </ImageListItem>
          ))}
        </ImageList>
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
