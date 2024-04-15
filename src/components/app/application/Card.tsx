import { useAppApplication, useAppUser } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import {
  Favorite as FollowIcon,
  CloudDownload as OwnIcon,
  NewReleases as ReleaseIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

type ApplicationCardProps = OverridesCardProps & {
  data: {
    id: string;
    name: string;
    providerId: string;
  };
};
export const ApplicationCard = ({ overrides, data }: ApplicationCardProps) => {
  const { data: application } = useAppApplication(data.id);
  const { data: provider } = useAppUser(data.providerId);

  return (
    <Card {...overrides?.CardProps}>
      <CardContent {...overrides?.CardContentProps}>
        <List disablePadding>
          <ListItem disableGutters>
            <ListItemAvatar>
              <Avatar src={application.primaryIcon?.url}>
                {application.primaryIconText}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={data.name}
              secondary={provider.providerName}
            />
          </ListItem>
        </List>
        <Divider />
        <Stack
          direction={'row'}
          spacing={2}
          divider={<Divider flexItem orientation="vertical" />}
          alignItems="center"
          sx={{ width: 1, pt: 2 }}
        >
          <Stack
            direction={'column'}
            sx={{ flexGrow: 1 }}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <OwnIcon
              sx={{
                fontSize: (theme) => theme.typography.body1.fontSize,
              }}
            />
            <Typography sx={{ fontFamily: 'Roboto Mono' }} variant="body2">
              {application.count.Owners}
            </Typography>
          </Stack>
          <Stack
            direction={'column'}
            sx={{ flexGrow: 1 }}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <FollowIcon
              sx={{
                fontSize: (theme) => theme.typography.body1.fontSize,
              }}
            />
            <Typography sx={{ fontFamily: 'Roboto Mono' }} variant="body2">
              {application.count.Followers}
            </Typography>
          </Stack>
          <Stack
            direction={'column'}
            sx={{ flexGrow: 1 }}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <ReleaseIcon
              sx={{
                fontSize: (theme) => theme.typography.body1.fontSize,
              }}
            />
            <Typography sx={{ fontFamily: 'Roboto Mono' }} variant="body2">
              {application.latestVersionText}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
