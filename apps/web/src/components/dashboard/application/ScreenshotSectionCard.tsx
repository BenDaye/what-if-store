import type { UseDashboardApplicationHookDataSchema } from '@/hooks';
import type { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, CardHeader } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useTranslation } from 'next-i18next';
import { AssetCard } from './AssetCard';

type ScreenshotSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const ScreenshotSectionCard = ({ overrides, defaultValues }: ScreenshotSectionCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader title={t('application:Media.Screenshots')} {...overrides?.CardHeaderProps} />
      <CardContent {...overrides?.CardContentProps}>
        <Grid container spacing={2}>
          {defaultValues.screenshots.filter(Boolean).map((asset) => (
            <Grid key={asset?.id} xs={12} lg={6} xl={4}>
              <AssetCard asset={asset} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
