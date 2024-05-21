import type { UseDashboardApplicationHookDataSchema } from '@/hooks';
import type { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'next-i18next';

type GroupSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const GroupSectionCard = ({
  overrides,
  // defaultValues
}: GroupSectionCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader title={t('application:Group._')} {...overrides?.CardHeaderProps} />
      <CardContent {...overrides?.CardContentProps} />
    </Card>
  );
};
