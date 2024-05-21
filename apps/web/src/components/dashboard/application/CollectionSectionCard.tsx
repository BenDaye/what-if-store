import type { UseDashboardApplicationHookDataSchema } from '@/hooks';
import type { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'next-i18next';

type CollectionSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const CollectionSectionCard = ({
  overrides,
  //defaultValues
}: CollectionSectionCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader title={t('application:Collection._')} {...overrides?.CardHeaderProps} />
      <CardContent {...overrides?.CardContentProps} />
    </Card>
  );
};
