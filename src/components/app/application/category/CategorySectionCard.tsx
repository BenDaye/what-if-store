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
import { ApplicationCategory } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { SimpleApplicationCard } from '../Card';

type CategorySectionCardProps = OverridesCardProps & {
  input: ApplicationListInputSchema;
  data: UseAppApplicationsHookDataSchema;
};
export const CategorySectionCard = ({
  data,
  input,
  overrides,
}: CategorySectionCardProps) => {
  const _data = useMemo(
    () =>
      data
        .filter((v) =>
          input.platforms?.length
            ? v.Information?.platforms.some((platform) =>
                input.platforms?.includes(platform),
              )
            : true,
        )
        .filter((v) =>
          input.locales?.length
            ? v.Information?.locales.some((locale) =>
                input.locales?.includes(locale),
              )
            : true,
        )
        .filter((v) =>
          input.countries?.length
            ? v.Information?.countries.some((country) =>
                input.countries?.includes(country),
              )
            : true,
        )
        .filter((v) =>
          input.ageRating ? v.Information?.ageRating === input.ageRating : true,
        ),
    [data, input],
  );
  return (
    <Card {...overrides?.CardProps}>
      <CardContent {...overrides?.CardContentProps}>
        <Stack direction={'column'} spacing={2} alignItems={'stretch'}>
          {input.category?.map((item) => (
            <CommonSection
              key={item}
              data={_data.filter((v) => v.category === item)}
              category={item}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

type CommonSectionProps = {
  category: ApplicationCategory;
  data: UseAppApplicationsHookDataSchema;
};
const CommonSection = ({
  category,
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
        <Typography variant="h6">
          {t(`application:Category.Name.${category}`)}
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
