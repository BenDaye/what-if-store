import { FallbackString } from '@/constants/common';
import type { RouterOutput } from '@/utils/trpc';
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

type ProviderProfileCardProps = {
  data?: RouterOutput['protectedDashboardProvider']['getById'];
};

export const ProviderProfileCard = ({ data }: ProviderProfileCardProps) => {
  return (
    <Card
      sx={{
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        subheader="Provider Profile"
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
            alt={`Avatar${data?.id}`}
            src={data?.avatar || undefined}
            sx={{
              height: 120,
              width: 120,
              margin: 'auto',
            }}
            variant="rounded"
          >
            {data?.name?.charAt(0) ?? FallbackString}
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
            primary={data?.name ?? FallbackString}
            primaryTypographyProps={{
              variant: 'h6',
              letterSpacing: 0.5,
            }}
            secondary={data?.email ?? FallbackString}
            secondaryTypographyProps={{
              variant: 'body2',
            }}
            sx={{
              flex: 0,
            }}
          />
          <Typography variant="body2" color="text.secondary" component="div" sx={{ flex: 1, mb: 0.8 }}>
            {data?.bio ?? FallbackString}
          </Typography>
        </Box>
      </ListItem>
      <Divider sx={{ opacity: 0.6 }} variant="middle" />
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" sx={{ opacity: 0.6, height: 64 }} />}
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
