import { useDashboardApplication } from '@/hooks';
import { IdSchema } from '@/server/schemas';
import {
  Favorite as FollowIcon,
  CloudDownload as OwnIcon,
} from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
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
  Tab,
  Typography,
} from '@mui/material';
import { useState } from 'react';
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
      <ApplicationCardContent
        data={{ description }}
        overrides={{ CardContentProps: overrides?.CardContentProps }}
      />
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

type ApplicationCardContentProps = {
  data: {
    description: string;
  };
  overrides?: {
    CardContentProps?: CardContentProps;
  };
};

type TabIndex = 'Readme' | 'Versions' | 'Comments';

const ApplicationCardContent = ({
  data,
  overrides,
}: ApplicationCardContentProps) => {
  const [tabIndex, setTabIndex] = useState<TabIndex>('Readme');
  return (
    <CardContent sx={{ p: 0 }} {...overrides?.CardContentProps}>
      <TabContext value={tabIndex}>
        <TabList
          onChange={(_, newIndex) => setTabIndex(newIndex)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Readme" value="Readme" />
          <Tab label="Versions" value="Versions" />
          <Tab label="Comments" value="Comments" disabled />
        </TabList>
        <TabPanel value="Readme">
          <Typography>{`// TODO: cache and render the markdown file`}</Typography>
        </TabPanel>
        <TabPanel value="Versions">
          <Typography>Version</Typography>
        </TabPanel>
        <TabPanel value="Comments">
          <Typography>Comments</Typography>
        </TabPanel>
      </TabContext>
    </CardContent>
  );
};
