import { EmptyDataBox } from '@/components/common';
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
  const { t } = useTranslation();
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
        pb: 1,
      }}
    >
      <Divider />
      <Stack
        direction={'row'}
        alignItems={'baseline'}
        justifyContent={'space-between'}
        sx={{
          mt: 1,
          mb: 2,
        }}
      >
        <Typography variant="h6">
          {type === ApplicationGroupType.Temporary
            ? name
            : t(`application:Group.Name.${name}`)}
        </Typography>
        <Button>{t('common:View')}</Button>
      </Stack>
      <Grid container spacing={2}>
        {applications.map((item) => (
          <Grid key={item.id} xs={12} sm={6} md={4} lg={3} xl={2}>
            <SimpleApplicationCard data={item} />
          </Grid>
        ))}
      </Grid>
      {!applications.length && <EmptyDataBox />}
    </Box>
  );
};
