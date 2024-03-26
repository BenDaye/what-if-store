import { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'next-i18next';

type OwnSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const OwnSectionCard = ({
  overrides,
  defaultValues,
}: OwnSectionCardProps) => {
  const { t: tApplicationOwn } = useTranslation('application', {
    keyPrefix: 'Own',
  });

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={tApplicationOwn('_', 'Own')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}></CardContent>
    </Card>
  );
};
