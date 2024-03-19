import { useDashboardApplication } from '@/hooks';
import { IdSchema } from '@/server/schemas';
import {
  Favorite as FollowIcon,
  CloudDownload as OwnIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Card,
  CardActionsProps,
  CardContent,
  CardContentProps,
  CardHeader,
  CardHeaderProps,
  CardProps,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { UserLink } from '../user';

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
      <ApplicationCardHeader
        data={{
          name,
          avatarSrc,
          avatarText,
          latestVersion,
          providerId: provider?.id,
          OwnedByUsers: data?._count.OwnedByUsers,
          FollowedByUsers: data?._count.FollowedByUsers,
          description: description,
        }}
        overrides={{
          CardHeaderProps: overrides?.CardHeaderProps,
        }}
      />
      <CardContent></CardContent>
    </Card>
  );
};

type ApplicationCardHeaderProps = {
  data: {
    name: string;
    avatarSrc?: string;
    avatarText: string;
    latestVersion: string;
    providerId?: string;
    OwnedByUsers?: number;
    FollowedByUsers?: number;
    description: string;
  };
  overrides?: {
    CardHeaderProps?: CardHeaderProps;
  };
};

const ApplicationCardHeader = ({
  data: {
    name,
    avatarSrc,
    avatarText,
    latestVersion,
    providerId,
    OwnedByUsers,
    FollowedByUsers,
    description,
  },
  overrides,
}: ApplicationCardHeaderProps) => {
  return (
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
        <Stack direction="row" spacing={1} alignItems="center">
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
            spacing={2}
            divider={<Divider flexItem orientation="vertical" />}
            alignItems="center"
          >
            {providerId && <UserLink userId={providerId} withProvider />}
            <Stack direction="row" alignItems="baseline">
              <OwnIcon
                sx={{
                  mr: 1,
                  fontSize: (theme) => theme.typography.overline.fontSize,
                }}
              />
              <Typography>{OwnedByUsers}</Typography>
            </Stack>
            <Stack direction="row" alignItems="baseline">
              <FollowIcon
                sx={{
                  mr: 1,
                  fontSize: (theme) => theme.typography.overline.fontSize,
                }}
              />
              <Typography>{FollowedByUsers}</Typography>
            </Stack>
          </Stack>
          <Typography variant="body2">{description}</Typography>
        </Stack>
      }
      sx={{ alignItems: 'flex-start' }}
      {...overrides?.CardHeaderProps}
    />
  );
};
