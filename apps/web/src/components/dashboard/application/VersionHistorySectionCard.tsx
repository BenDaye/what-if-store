import type { UseDashboardApplicationHookDataSchema } from '@/hooks';
import type { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent, CardHeader, Chip, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useTranslation } from 'next-i18next';

type VersionHistorySectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const VersionHistorySectionCard = ({ overrides, defaultValues }: VersionHistorySectionCardProps) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader title={t('application:Version._')} {...overrides?.CardHeaderProps} />
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
  const { t } = useTranslation();

  return (
    <Card {...overrides?.CardProps}>
      <CardHeader
        title={`v${version.version}`}
        titleTypographyProps={{
          letterSpacing: 1,
        }}
        subheader={t('application:Version.ReleasedAt', {
          releaseDate: format(version.releaseDate, 'yyyy/MM/dd'),
        })}
        subheaderTypographyProps={{
          variant: 'subtitle2',
        }}
        action={
          <Stack direction="row" spacing={1}>
            {version.latest && (
              <Chip label={t('application:Version.Latest')} color="success" variant="outlined" />
            )}
            {version.preview && (
              <Chip label={t('application:Version.Preview')} color="warning" variant="outlined" />
            )}
            {version.deprecated && <Chip label={t('application:Version.Deprecated')} color="error" />}
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
