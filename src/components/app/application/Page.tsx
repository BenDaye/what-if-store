import { EmptyDataBox } from '@/components/common';
import { FallbackId } from '@/constants/common';
import {
  UseAppApplicationHookDataSchema,
  useAppApplication,
  useAppUser,
  useDashboardApplicationAsset,
} from '@/hooks';
import { OverridesProps } from '@/types/overrides';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionDetailsProps,
  AccordionProps,
  AccordionSummary,
  AccordionSummaryProps,
  Avatar,
  AvatarGroup,
  AvatarProps,
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import currency from 'currency.js';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { PropsWithChildren, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { ProviderLink } from '../provider';
import { FollowApplicationButton } from './FollowButton';
import { OwnApplicationButton } from './OwnButton';
import { ApplicationVersionChip } from './Version';

const Editor = dynamic(() => import('../../common/BlockNote/Editor'), {
  ssr: false,
});

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

type ApplicationPageProps = {
  applicationId: string;
};
export const ApplicationPage = ({ applicationId }: ApplicationPageProps) => {
  const { data } = useAppApplication(applicationId);

  return (
    <Card>
      <ApplicationPageHeader data={data} />
      <Grid container spacing={2}>
        <Grid xs={12} lg={8} xl={10}>
          <ApplicationPagePrimaryContent data={data} />
        </Grid>
        <Grid xs={12} lg>
          <ApplicationPageSecondaryContent data={data} />
        </Grid>
      </Grid>
    </Card>
  );
};

const ApplicationPageHeader = ({
  data,
}: {
  data: UseAppApplicationHookDataSchema;
}) => {
  return (
    <CardHeader
      avatar={
        <Avatar src={data.primaryIcon?.url} sx={{ height: 96, width: 96 }}>
          {data.primaryIconText}
        </Avatar>
      }
      title={
        <Stack direction={'row'} gap={1} alignItems={'center'}>
          <Typography variant="h6">{data.name}</Typography>
          <ApplicationVersionChip versions={data.versions} />
        </Stack>
      }
      subheader={
        <Stack direction={'column'} gap={1}>
          <Stack
            direction={'row'}
            alignItems={'center'}
            gap={1}
            divider={
              <Divider flexItem orientation="vertical" variant="middle" />
            }
          >
            {data.provider?.id && (
              <ProviderLink providerId={data.provider.id} />
            )}
            <FollowApplicationButton
              applicationId={data.id}
              text={currency(data.count.Followers, {
                precision: 0,
                symbol: '',
              }).format()}
            />
            <OwnApplicationButton
              applicationId={data.id}
              text={currency(data.count.Owners, {
                precision: 0,
                symbol: '',
              }).format()}
            />
          </Stack>
          <Typography variant="body1">{data.description}</Typography>
        </Stack>
      }
      sx={{ alignItems: 'flex-start' }}
    />
  );
};

const ApplicationPagePrimaryContent = ({
  data,
}: {
  data: UseAppApplicationHookDataSchema;
}) => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const theme = useTheme();
  return (
    <Box>
      <Tabs
        value={currentTabIndex}
        onChange={(ev, nextTab) => setCurrentTabIndex(nextTab)}
      >
        <Tab label="readme" />
        <Tab label="versions" />
        <Tab label="reviews" />
        <Tab label="issues" />
      </Tabs>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={currentTabIndex}
        onChangeIndex={setCurrentTabIndex}
        autoplay={false}
      >
        <ApplicationPageReadmeContent assetId={data.readme} />
        <Box>2</Box>
        <Box>3</Box>
        <Box>4</Box>
      </AutoPlaySwipeableViews>
    </Box>
  );
};

const ApplicationPageReadmeContent = ({ assetId }: { assetId?: string }) => {
  const { t } = useTranslation();
  const { data } = useDashboardApplicationAsset(assetId ?? FallbackId);
  return assetId ? (
    <Editor initialContent={data.content} editable={false} />
  ) : (
    <Box
      sx={{
        height: 120,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="caption" color="text.disabled">
        {t('common:NoData')}
      </Typography>
    </Box>
  );
};

const ApplicationPageSecondaryContent = ({
  data,
}: {
  data: UseAppApplicationHookDataSchema;
}) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Box sx={{ height: 48 }} />
      <Stack sx={{ px: 1, pb: 2 }}>
        <ApplicationPageSecondaryContentSection
          title={t('application:Category._')}
        >
          <Chip
            variant="outlined"
            label={t(`application:Category.Name.${data.category}`)}
          />
        </ApplicationPageSecondaryContentSection>
        <ApplicationPageSecondaryContentSection
          title={t('application:Tag.Tags')}
        >
          {data.tags.length ? (
            data.tags.map((item) => (
              <Chip key={item.id} variant="outlined" label={item.name} />
            ))
          ) : (
            <EmptyDataBox height={32} />
          )}
        </ApplicationPageSecondaryContentSection>
        <ApplicationPageSecondaryContentSection
          title={t('application:Information.Information')}
        >
          <ApplicationPageSecondaryContentInformationList data={data} />
        </ApplicationPageSecondaryContentSection>
        <ApplicationPageSecondaryContentSection
          title={t('application:Group.Groups')}
        >
          {data.groups.length ? (
            data.groups.map((item) => (
              <Chip key={item.id} variant="outlined" label={item.name} />
            ))
          ) : (
            <EmptyDataBox height={32} />
          )}
        </ApplicationPageSecondaryContentSection>
        <ApplicationPageSecondaryContentSection
          title={t('application:Collection.Collections')}
        >
          {data.collections.length ? (
            data.collections.map((item) => (
              <Chip key={item.id} variant="outlined" label={item.name} />
            ))
          ) : (
            <EmptyDataBox height={32} />
          )}
        </ApplicationPageSecondaryContentSection>
        <ApplicationPageSecondaryContentSection
          title={t('application:Follow.Followers')}
        >
          {data.followers.length ? (
            <AvatarGroup variant="rounded" total={data.followers.length}>
              {data.followers.map((item) => (
                <UserAvatar key={item.userId} userId={item.userId} />
              ))}
            </AvatarGroup>
          ) : (
            <EmptyDataBox height={32} />
          )}
        </ApplicationPageSecondaryContentSection>
        <ApplicationPageSecondaryContentSection
          title={t('application:Own.Owners')}
        >
          {data.owners.length ? (
            <AvatarGroup variant="rounded" total={data.owners.length}>
              {data.owners.map((item) => (
                <UserAvatar key={item.userId} userId={item.userId} />
              ))}
            </AvatarGroup>
          ) : (
            <EmptyDataBox height={32} />
          )}
        </ApplicationPageSecondaryContentSection>
      </Stack>
    </Box>
  );
};

type ApplicationPageUserAvatarProps = OverridesProps<{
  AvatarProps?: AvatarProps;
}> & {
  userId: string;
};
const UserAvatar = ({ overrides, userId }: ApplicationPageUserAvatarProps) => {
  const {
    data: { avatarText, avatarSrc },
  } = useAppUser(userId);
  return (
    <Avatar src={avatarSrc || undefined} {...overrides?.AvatarProps}>
      {avatarText}
    </Avatar>
  );
};

type ApplicationPageSecondaryContentSectionProps = PropsWithChildren<
  OverridesProps<{
    WrapperProps?: Omit<AccordionProps, 'children'>;
    HeaderProps?: Omit<AccordionSummaryProps, 'children'>;
    ContentProps?: Omit<AccordionDetailsProps, 'children'>;
  }> & {
    title: string;
    defaultExpanded?: AccordionProps['defaultExpanded'];
  }
>;
const ApplicationPageSecondaryContentSection = ({
  overrides,
  title,
  defaultExpanded = true,
  children,
}: ApplicationPageSecondaryContentSectionProps) => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      variant="outlined"
      disableGutters
      {...overrides?.WrapperProps}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        {...overrides?.HeaderProps}
      >
        {title}
      </AccordionSummary>
      <AccordionDetails {...overrides?.ContentProps}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

const ApplicationPageSecondaryContentInformationList = ({
  data,
}: {
  data: UseAppApplicationHookDataSchema;
}) => {
  const { t } = useTranslation();
  return (
    <List disablePadding dense>
      <ListItem disablePadding divider>
        <ListItemText
          primary={t('application:Information.Website')}
          primaryTypographyProps={{
            variant: 'caption',
            color: 'text.secondary',
          }}
          secondary={data.website}
          secondaryTypographyProps={{
            variant: 'body2',
            noWrap: true,
            textOverflow: 'ellipsis',
            color: 'text.primary',
          }}
        />
      </ListItem>
      <ListItem disablePadding divider>
        <ListItemText
          primary={t('application:Information.Github')}
          primaryTypographyProps={{
            variant: 'caption',
            color: 'text.secondary',
          }}
          secondary={data.github}
          secondaryTypographyProps={{
            variant: 'body2',
            noWrap: true,
            textOverflow: 'ellipsis',
            color: 'text.primary',
          }}
        />
      </ListItem>
      <ListItem disablePadding divider>
        <ListItemText
          primary={t('application:Information.AgeRating')}
          primaryTypographyProps={{
            variant: 'caption',
            color: 'text.secondary',
          }}
          secondary={data.ageRating}
          secondaryTypographyProps={{
            variant: 'body2',
            noWrap: true,
            textOverflow: 'ellipsis',
            color: 'text.primary',
          }}
        />
      </ListItem>
      <ListItem disablePadding divider>
        <ListItemText
          primary={t('application:Information.Compatibility')}
          primaryTypographyProps={{
            variant: 'caption',
            color: 'text.secondary',
          }}
          secondary={
            <Stack gap={1}>
              {data.compatibility.map((item) => (
                <Typography
                  key={item.platform}
                  variant="body2"
                  color="text.primary"
                >
                  {item.requirement}
                </Typography>
              ))}
            </Stack>
          }
          secondaryTypographyProps={{
            component: 'div',
          }}
        />
      </ListItem>
      <ListItem disablePadding divider>
        <ListItemText
          primary={t('application:Information.Countries')}
          primaryTypographyProps={{
            variant: 'caption',
            color: 'text.secondary',
          }}
          secondary={
            <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
              {data.countries.map((item) => (
                <Chip key={item} label={item} />
              ))}
            </Stack>
          }
          secondaryTypographyProps={{
            component: 'div',
          }}
        />
      </ListItem>
      <ListItem disablePadding divider>
        <ListItemText
          primary={t('application:Information.Locales')}
          primaryTypographyProps={{
            variant: 'caption',
            color: 'text.secondary',
          }}
          secondary={
            <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
              {data.locales.map((item) => (
                <Chip key={item} label={item} />
              ))}
            </Stack>
          }
          secondaryTypographyProps={{
            component: 'div',
          }}
        />
      </ListItem>
    </List>
  );
};
