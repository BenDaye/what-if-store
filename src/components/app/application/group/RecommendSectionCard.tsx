import { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent } from '@mui/material';

type RecommendSectionCardProps = OverridesCardProps & {
  applicationIds: string[];
};
export const RecommendSectionCard = ({
  applicationIds,
  overrides,
}: RecommendSectionCardProps) => {
  return (
    <Card {...overrides?.CardProps}>
      <CardContent {...overrides?.CardContentProps}>1</CardContent>
    </Card>
  );
};
