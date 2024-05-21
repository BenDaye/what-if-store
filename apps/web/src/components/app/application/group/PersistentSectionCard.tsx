import type { UseAppApplicationGroupsDataSchema } from '@/hooks';
import type { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, Stack } from '@mui/material';
import { CommonSection } from './Section';

type PersistentSectionCardProps = OverridesCardProps & {
  data: UseAppApplicationGroupsDataSchema;
};
export const PersistentSectionCard = ({ data, overrides }: PersistentSectionCardProps) => {
  return (
    <Card {...overrides?.CardProps}>
      <CardContent {...overrides?.CardContentProps}>
        <Stack direction="column" spacing={2} alignItems="stretch">
          {data.map((item) => (
            <CommonSection key={item.name} data={item} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
