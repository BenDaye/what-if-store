import { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';

type VersionHistorySectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const VersionHistorySectionCard = ({
  overrides,
  defaultValues,
}: VersionHistorySectionCardProps) => {
  const { t: tApplicationVersion } = useTranslation('application', {
    keyPrefix: 'Version',
  });

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={tApplicationVersion('_', 'Version')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <Stack spacing={2}>
          {defaultValues.versions.map((version) => (
            <VersionCard key={version.id} version={version} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

type VersionCardProps = OverridesCardProps & {
  version: UseDashboardApplicationHookDataSchema['versions'][number];
};

export const VersionCard = ({ overrides, version }: VersionCardProps) => {
  const { t: tApplicationVersion } = useTranslation('application', {
    keyPrefix: 'Version',
  });

  return (
    <Card {...overrides?.CardProps}>
      <CardHeader
        title={`v${version.version}`}
        titleTypographyProps={{
          letterSpacing: 1,
        }}
        subheader={tApplicationVersion(
          'ReleasedAt',
          'Released at {{releaseDate}}.',
          {
            releaseDate: format(version.releaseDate, 'yyyy/MM/dd'),
          },
        )}
        subheaderTypographyProps={{
          variant: 'subtitle2',
        }}
        action={
          <Stack direction="row" spacing={1}>
            {version.latest && (
              <Chip
                label={tApplicationVersion('Latest', 'Latest')}
                color="success"
                variant="outlined"
              />
            )}
            {version.preview && (
              <Chip
                label={tApplicationVersion('Preview', 'Preview')}
                color="warning"
                variant="outlined"
              />
            )}
            {version.deprecated && (
              <Chip
                label={tApplicationVersion('Deprecated', 'Deprecated')}
                color="error"
              />
            )}
          </Stack>
        }
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <Typography variant="body2" paragraph>
          {version.changelog}
        </Typography>
      </CardContent>
    </Card>
  );
};
