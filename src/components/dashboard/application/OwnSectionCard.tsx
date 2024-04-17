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
  const { t } = useTranslation();

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={t('application:Own._')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}></CardContent>
    </Card>
  );
};
