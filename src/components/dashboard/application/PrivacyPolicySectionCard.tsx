import { Lexical } from '@/components/common';
import { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'next-i18next';

type PrivacyPolicySectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const PrivacyPolicySectionCard = ({
  overrides,
  defaultValues,
}: PrivacyPolicySectionCardProps) => {
  const { t: tApplicationPrivacyPolicy } = useTranslation('application', {
    keyPrefix: 'PrivacyPolicy',
  });

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={tApplicationPrivacyPolicy('_', 'Privacy Policy')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <Lexical
          namespace="PrivacyPolicy"
          placeholderText={tApplicationPrivacyPolicy('Placeholder', '')}
        />
      </CardContent>
    </Card>
  );
};
