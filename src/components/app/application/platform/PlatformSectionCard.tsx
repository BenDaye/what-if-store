import { UseAppApplicationsHookDataSchema } from '@/hooks';
import { ApplicationListInputSchema } from '@/server/schemas';
import { OverridesCardProps } from '@/types/overrides';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { ApplicationPlatform } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { SimpleApplicationCard } from '../Card';

type PlatformSectionCardProps = OverridesCardProps & {
  input: ApplicationListInputSchema;
  data: UseAppApplicationsHookDataSchema;
};
export const PlatformSectionCard = ({
  data,
  input,
  overrides,
}: PlatformSectionCardProps) => {
  return (
    <Card {...overrides?.CardProps}>
      <CardContent {...overrides?.CardContentProps}>
        <Stack direction={'column'} spacing={2} alignItems={'stretch'}>
          {input.platforms?.map((item) => (
            <CommonSection
              key={item}
              data={data.filter((v) => v.Information?.platforms.includes(item))}
              platform={item}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

type CommonSectionProps = {
  platform: ApplicationPlatform;
  data: UseAppApplicationsHookDataSchema;
};
const CommonSection = ({
  platform,
  data: applications,
}: CommonSectionProps) => {
  const { t } = useTranslation();

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
        <Typography variant="h6">{platform}</Typography>
        <Button>{t('common:View')}</Button>
      </Stack>
      <Grid container spacing={2}>
        {applications.map((item) => (
          <Grid key={item.id} xs={12} sm={6} md={4} lg={3} xl={2}>
            <SimpleApplicationCard data={item} />
          </Grid>
        ))}
      </Grid>
      {!applications.length && (
        <Box
          sx={{
            height: 120,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.disabled">
            {t('common:NoData')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
