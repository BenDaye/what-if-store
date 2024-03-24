import { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useTranslation } from 'next-i18next';

type MediaSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const MediaSectionCard = ({
  overrides,
  defaultValues,
}: MediaSectionCardProps) => {
  const { t: tApplication } = useTranslation('application', {
    keyPrefix: 'Media',
  });

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={tApplication('_', 'Media')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <Grid container spacing={2}>
          <Grid xs={12} lg={6} xl={4}>
            <MediaCard defaultValues={defaultValues.primaryIcon} />
          </Grid>
          <Grid xs={12} lg={6} xl={4}>
            <MediaCard defaultValues={defaultValues.primaryBackground} />
          </Grid>
          <Grid xs={12} lg={6} xl={4}>
            <MediaCard defaultValues={defaultValues.primaryBanner} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

type MediaCardProps = OverridesCardProps & {
  defaultValues?: UseDashboardApplicationHookDataSchema['assets'][number];
};
const MediaCard = ({ defaultValues, overrides }: MediaCardProps) => {
  return defaultValues ? (
    <Card {...overrides?.CardProps}>
      <CardMedia
        sx={{ height: 128, backgroundSize: 'contain' }}
        image={defaultValues.url}
        title={defaultValues.type}
        {...overrides?.CardMediaProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          {defaultValues.type}
        </Typography>
      </CardContent>
    </Card>
  ) : null;
};
