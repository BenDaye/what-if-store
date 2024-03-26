import { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'next-i18next';

type TermsOfUseSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const TermsOfUseSectionCard = ({
  overrides,
  defaultValues,
}: TermsOfUseSectionCardProps) => {
  const { t: tApplicationTermsOfUse } = useTranslation('application', {
    keyPrefix: 'TermsOfUse',
  });

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={tApplicationTermsOfUse('_', 'TermsOfUse')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}></CardContent>
    </Card>
  );
};
