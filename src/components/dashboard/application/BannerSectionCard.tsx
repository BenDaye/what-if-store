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

type BannerSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const BannerSectionCard = ({
  overrides,
  defaultValues,
}: BannerSectionCardProps) => {
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
        title={tApplication('Banners', 'Banners')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <ImageList cols={2} rowHeight={180}>
          {defaultValues.banners.map((item) => (
            <ImageListItem key={item.id}>
              <Image
                alt="banner"
                src={item.url}
                width={320}
                height={180}
                placeholder={shimmerSvg(320, 180)}
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
