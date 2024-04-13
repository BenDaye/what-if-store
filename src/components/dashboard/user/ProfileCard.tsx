import { UseDashboardUserHookDataSchema } from '@/hooks';
import { Edit as EditIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

type UserProfileCardProps = {
  data: UseDashboardUserHookDataSchema;
};

export const UserProfileCard = ({
  data: { id, avatarSrc, avatarText, nickname, email, bio },
}: UserProfileCardProps) => {
  return (
    <Card
      sx={{
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        subheader="User Profile"
        subheaderTypographyProps={{
          variant: 'subtitle2',
          color: 'text.secondary',
        }}
        action={
          <IconButton edge="end" size="small">
            <EditIcon />
          </IconButton>
        }
      />
      <ListItem sx={{ gap: 2, mb: 1, alignItems: 'stretch' }}>
        <ListItemAvatar>
          <Avatar
            alt={`Avatar${id}`}
            src={avatarSrc || undefined}
            sx={{
              height: 120,
              width: 120,
              margin: 'auto',
            }}
            variant="rounded"
          >
            {avatarText}
          </Avatar>
        </ListItemAvatar>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ListItemText
            primary={nickname}
            primaryTypographyProps={{
              variant: 'h6',
              letterSpacing: 0.5,
            }}
            secondary={email}
            secondaryTypographyProps={{
              variant: 'body2',
            }}
            sx={{
              flex: 0,
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            component={'div'}
            sx={{ flex: 1, mb: 0.8 }}
          >
            {bio}
          </Typography>
        </Box>
      </ListItem>
      <Divider sx={{ opacity: 0.6 }} variant="middle" />
      <Stack
        direction="row"
        divider={
          <Divider orientation="vertical" sx={{ opacity: 0.6, height: 64 }} />
        }
        sx={{
          flex: 1,
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Likes
          </Typography>
          <Typography variant="h5" color="text.primary">
            24
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Subscriptions
          </Typography>
          <Typography variant="h5" color="text.primary">
            2
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Paid
          </Typography>
          <Typography variant="h5" color="text.primary">
            8
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};
