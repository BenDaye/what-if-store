import { useAppApplication, useAppUser } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import {
  Favorite as FollowIcon,
  CloudDownload as OwnIcon,
  NewReleases as ReleaseIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ReactNode, useMemo } from 'react';
import { FollowApplicationButton } from './FollowButton';
import { OwnApplicationButton } from './OwnButton';

type ApplicationCardProps = OverridesCardProps & {
  data: {
    id: string;
    name: string;
    providerId: string;
  };
  mode?: 'simple' | 'detailed';
  secondaryInfo?:
    | 'providerName'
    | 'latestVersionText'
    | 'category'
    | 'description';
};
export const ApplicationCard = ({
  overrides,
  data,
  mode = 'simple',
  secondaryInfo = 'providerName',
}: ApplicationCardProps) => {
  return mode === 'simple' ? (
    <SimpleApplicationCard
      data={data}
      overrides={overrides}
      secondaryInfo={secondaryInfo}
    />
  ) : (
    <DetailedApplicationCard
      data={data}
      overrides={overrides}
      secondaryInfo={secondaryInfo}
    />
  );
};

export const SimpleApplicationCard = ({
  overrides,
  data,
  secondaryInfo = 'description',
}: Omit<ApplicationCardProps, 'mode'>) => {
  const { data: application } = useAppApplication(data.id);
  const { data: provider } = useAppUser(data.providerId);

  const { t: tApplicationCategoryName } = useTranslation('application', {
    keyPrefix: 'Category.Name',
  });
  const secondary = useMemo((): ReactNode => {
    switch (secondaryInfo) {
      case 'providerName':
        return provider.providerName;
      case 'latestVersionText':
        return application.latestVersionText;
      case 'category':
        return tApplicationCategoryName(application.category);
      case 'description':
        return application.description;
      default:
        return application.description;
    }
  }, [secondaryInfo, application, provider, tApplicationCategoryName]);

  const { push } = useRouter();

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardActionArea
        onClick={() => push(`/app/application/${data.id}`)}
        {...overrides?.CardActionAreaProps}
      >
        <CardContent sx={{ py: 0 }} {...overrides?.CardContentProps}>
          <List disablePadding>
            <ListItem disableGutters>
              <ListItemAvatar>
                <Avatar src={application.primaryIcon?.url}>
                  {application.primaryIconText}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={data.name}
                secondary={secondary}
                secondaryTypographyProps={{
                  noWrap: true,
                  textOverflow: 'ellipsis',
                }}
              />
            </ListItem>
          </List>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ pt: 0 }} {...overrides?.CardActionsProps}>
        <Box flexGrow={1} />
        <FollowApplicationButton
          applicationId={data.id}
          followers={application.followers}
        />
        <OwnApplicationButton
          applicationId={data.id}
          owners={application.owners}
        />
      </CardActions>
    </Card>
  );
};

export const DetailedApplicationCard = ({
  overrides,
  data,
  secondaryInfo = 'providerName',
}: Omit<ApplicationCardProps, 'mode'>) => {
  const { data: application } = useAppApplication(data.id);
  const { data: provider } = useAppUser(data.providerId);

  const { t: tApplicationCategoryName } = useTranslation('application', {
    keyPrefix: 'Category.Name',
  });
  const secondary = useMemo((): ReactNode => {
    switch (secondaryInfo) {
      case 'providerName':
        return provider.providerName;
      case 'latestVersionText':
        return application.latestVersionText;
      case 'category':
        return tApplicationCategoryName(application.category);
      case 'description':
        return application.description;
      default:
        return application.description;
    }
  }, [secondaryInfo, application, provider, tApplicationCategoryName]);

  return (
    <Card {...overrides?.CardProps}>
      <CardActionArea {...overrides?.CardActionAreaProps}>
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
                secondary={secondary}
                secondaryTypographyProps={{
                  noWrap: true,
                  textOverflow: 'ellipsis',
                }}
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
      </CardActionArea>
    </Card>
  );
};
