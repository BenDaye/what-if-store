import { useDashboardApplication } from '@/hooks';
import { IdSchema } from '@/server/schemas';
import {
  Avatar,
  Card,
  CardActionsProps,
  CardContentProps,
  CardHeader,
  CardHeaderProps,
  CardProps,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { ProviderLink } from '../provider';

type ApplicationCardProps = {
  applicationId: IdSchema;
  overrides?: {
    CardProps?: CardProps;
    CardHeaderProps?: CardHeaderProps;
    CardContentProps?: CardContentProps;
    CardActionsProps?: CardActionsProps;
  };
};

export const ApplicationCard = ({
  applicationId,
  overrides,
}: ApplicationCardProps) => {
  const {
    name,
    avatarSrc,
    avatarText,
    latestVersion,
    provider,
    data,
    description,
  } = useDashboardApplication(applicationId);
  return (
    <Card {...overrides?.CardProps}>
      <CardHeader
        avatar={
          <Avatar
            src={avatarSrc}
            sx={{ height: 96, width: 96 }}
            variant="rounded"
          >
            {avatarText}
          </Avatar>
        }
        title={
          <Stack direction="row" spacing={1}>
            <Typography variant="h6" paragraph>
              {name}
            </Typography>
            <Chip label={latestVersion} size="small" sx={{ borderRadius: 1 }} />
          </Stack>
        }
        subheader={
          <Stack direction="column" spacing={1}>
            <Stack
              direction="row"
              spacing={1}
              divider={<Divider flexItem orientation="vertical" />}
            >
              {provider?.id && <ProviderLink providerId={provider.id} />}
              <Typography>{data?._count.OwnedByUsers}</Typography>
              <Typography>{data?._count.FollowedByUsers}</Typography>
            </Stack>
            <Typography variant="body2">{description}</Typography>
          </Stack>
        }
        {...overrides?.CardHeaderProps}
      />
    </Card>
  );
};
