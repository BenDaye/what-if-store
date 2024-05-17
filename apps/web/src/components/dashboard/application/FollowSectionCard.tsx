import { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'next-i18next';

type FollowSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const FollowSectionCard = ({
  overrides,
  defaultValues,
}: FollowSectionCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={t('application:Follow._')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}></CardContent>
    </Card>
  );
};
