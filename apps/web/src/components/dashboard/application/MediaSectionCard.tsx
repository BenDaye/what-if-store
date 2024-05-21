import type { UseDashboardApplicationHookDataSchema } from '@/hooks';
import type { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, CardHeader } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useTranslation } from 'next-i18next';
import { AssetCard } from './AssetCard';

type MediaSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const MediaSectionCard = ({ overrides, defaultValues }: MediaSectionCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader title={t('application:Media._')} {...overrides?.CardHeaderProps} />
      <CardContent {...overrides?.CardContentProps}>
        <Grid container spacing={2}>
          {[defaultValues.primaryIcon, defaultValues.primaryBackground, defaultValues.primaryBanner]
            .filter(Boolean)
            .map((asset) => (
              <Grid key={asset?.id} xs={12} lg={6} xl={4}>
                <AssetCard asset={asset} />
              </Grid>
            ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
