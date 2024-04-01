import { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('../../common/BlockNote/Editor'), {
  ssr: false,
});

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
      <CardContent {...overrides?.CardContentProps}>
        <Box sx={{ height: 1000, overflow: 'auto' }}>
          <Editor />
        </Box>
      </CardContent>
    </Card>
  );
};
