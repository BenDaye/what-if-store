import { UseAppApplicationGroupsDataSchema } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent } from '@mui/material';

type PermanentSectionCardProps = OverridesCardProps & {
  data: UseAppApplicationGroupsDataSchema;
};
export const PermanentSectionCard = ({
  data,
  overrides,
}: PermanentSectionCardProps) => {
  return (
    <Card {...overrides?.CardProps}>
      <CardContent {...overrides?.CardContentProps}>1</CardContent>
    </Card>
  );
};
