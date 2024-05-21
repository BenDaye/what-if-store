import { PermanentPresetGroupNames } from '@/constants/group';
import type { UseAppApplicationGroupsDataSchema } from '@/hooks';
import type { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, Stack } from '@mui/material';
import { useMemo } from 'react';
import { RecommendSection } from './RecommendSection';
import { CommonSection } from './Section';

type PermanentSectionCardProps = OverridesCardProps & {
  data: UseAppApplicationGroupsDataSchema;
};
export const PermanentSectionCard = ({ data, overrides }: PermanentSectionCardProps) => {
  const recommendedGroup = useMemo(
    () => data.find((item) => item.name === PermanentPresetGroupNames.Recommended),
    [data],
  );
  const newGroup = useMemo(() => data.find((item) => item.name === PermanentPresetGroupNames.New), [data]);
  const updatedGroup = useMemo(
    () => data.find((item) => item.name === PermanentPresetGroupNames.Updated),
    [data],
  );
  const promotionalGroup = useMemo(
    () => data.find((item) => item.name === PermanentPresetGroupNames.Promotional),
    [data],
  );

  return (
    <Card {...overrides?.CardProps}>
      <CardContent {...overrides?.CardContentProps}>
        <Stack direction="column" spacing={2} alignItems="stretch">
          {recommendedGroup && <RecommendSection data={recommendedGroup} />}
          {newGroup && <CommonSection data={newGroup} />}
          {updatedGroup && <CommonSection data={updatedGroup} />}
          {promotionalGroup && <CommonSection data={promotionalGroup} />}
        </Stack>
      </CardContent>
    </Card>
  );
};
