import {
  UseAppApplicationGroupsDataSchema,
  useAppApplicationGroup,
} from '@/hooks';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { ApplicationGroupType } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { SimpleApplicationCard } from '../Card';

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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <Divider />
      <Stack
        direction={'row'}
        alignItems={'baseline'}
        justifyContent={'space-between'}
        sx={{ mt: 1, mb: 2 }}
      >
        <Typography variant="h6">
          {type === ApplicationGroupType.Temporary
            ? name
            : tApplicationGroupName(name)}
        </Typography>
        <Button>{tCommon('View')}</Button>
      </Stack>
      <Grid container spacing={2}>
        {applications.map((item) => (
          <Grid key={item.id} xs={12} sm={6} md={4} lg={3} xl={2}>
            <SimpleApplicationCard data={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
