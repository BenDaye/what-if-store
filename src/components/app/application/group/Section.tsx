import {
  UseAppApplicationGroupsDataSchema,
  useAppApplicationGroup,
} from '@/hooks';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { ApplicationGroupType } from '@prisma/client';
import { useTranslation } from 'next-i18next';

type CommonSectionProps = {
  data: UseAppApplicationGroupsDataSchema[number];
};
export const CommonSection = ({ data: { id } }: CommonSectionProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tApplicationGroupName } = useTranslation('application', {
    keyPrefix: 'Group.Name',
  });
  const {
    data: { name, type, applications },
  } = useAppApplicationGroup(id);

  return (
    <Box
      component={'section'}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
    >
      <Divider />
      <Stack
        direction={'row'}
        alignItems={'baseline'}
        justifyContent={'space-between'}
      >
        <Typography variant="h6">
          {type === ApplicationGroupType.Temporary
            ? name
            : tApplicationGroupName(name)}
        </Typography>
        <Button>{tCommon('View')}</Button>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          height: 240,
        }}
      >
        <Box
          sx={{ width: 100, flexGrow: 0, flexShrink: 0, flexBasis: '33.33%' }}
        >
          1
        </Box>
        <Box
          sx={{ width: 100, flexGrow: 0, flexShrink: 0, flexBasis: '33.33%' }}
        >
          2
        </Box>
        <Box
          sx={{ width: 100, flexGrow: 0, flexShrink: 0, flexBasis: '33.33%' }}
        >
          3
        </Box>
        <Box
          sx={{ width: 100, flexGrow: 0, flexShrink: 0, flexBasis: '33.33%' }}
        >
          4
        </Box>
        <Box
          sx={{ width: 100, flexGrow: 0, flexShrink: 0, flexBasis: '33.33%' }}
        >
          5
        </Box>
      </Box>
    </Box>
  );
};
