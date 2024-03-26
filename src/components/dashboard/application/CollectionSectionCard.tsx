import { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'next-i18next';

type CollectionSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const CollectionSectionCard = ({
  overrides,
  defaultValues,
}: CollectionSectionCardProps) => {
  const { t: tApplicationCollection } = useTranslation('application', {
    keyPrefix: 'Collection',
  });

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={tApplicationCollection('_', 'Collection')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}></CardContent>
    </Card>
  );
};
