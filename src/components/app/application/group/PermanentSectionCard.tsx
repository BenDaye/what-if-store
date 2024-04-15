import { PermanentPresetGroupNames } from '@/constants/group';
import { UseAppApplicationGroupsDataSchema } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, Stack } from '@mui/material';
import { useMemo } from 'react';
import { RecommendSection } from './RecommendSection';
import { CommonSection } from './Section';

type PermanentSectionCardProps = OverridesCardProps & {
  data: UseAppApplicationGroupsDataSchema;
};
export const PermanentSectionCard = ({
  data,
  overrides,
}: PermanentSectionCardProps) => {
  const recommendedGroup = useMemo(
    () =>
      data.find((item) => item.name === PermanentPresetGroupNames.Recommended),
    [data],
  );
  const newGroup = useMemo(
    () => data.find((item) => item.name === PermanentPresetGroupNames.New),
    [data],
  );

  return (
    <Card {...overrides?.CardProps}>
      <CardContent {...overrides?.CardContentProps}>
        <Stack direction={'column'} spacing={2} alignItems={'stretch'}>
          {recommendedGroup && <RecommendSection data={recommendedGroup} />}
          {newGroup && <CommonSection data={newGroup} />}
        </Stack>
      </CardContent>
    </Card>
  );
};
