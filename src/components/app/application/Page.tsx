import { EmptyDataBox } from '@/components/common';
import { FallbackId } from '@/constants/common';
import {
  UseAppApplicationHookDataSchema,
  useAppApplication,
  useDashboardApplicationAsset,
} from '@/hooks';
import { OverridesProps } from '@/types/overrides';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  Stack,
  StackProps,
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
      <Stack gap={2} sx={{ px: 2, pb: 2 }}>
        <ApplicationPageSecondaryContentSection
          title={t('application:Category._')}
        >
          <Chip
            variant="outlined"
            label={t(`application:Category.Name.${data.category}`)}
          />
        </ApplicationPageSecondaryContentSection>
        <ApplicationPageSecondaryContentSection title={t('application:Tag._')}>
          {data.tags.length ? (
            data.tags.map((tag) => (
              <Chip key={tag.id} variant="outlined" label={tag.name} />
            ))
          ) : (
            <EmptyDataBox height={32} />
          )}
        </ApplicationPageSecondaryContentSection>
      </Stack>
    </Box>
  );
};

type ApplicationPageSecondaryContentSectionProps = PropsWithChildren<
  OverridesProps<{ WrapperProps?: StackProps }> & {
    title: string;
  }
>;
const ApplicationPageSecondaryContentSection = ({
  overrides,
  title,
  children,
}: ApplicationPageSecondaryContentSectionProps) => {
  return (
    <Stack gap={1} {...overrides?.WrapperProps}>
      <Typography variant="subtitle2">{title}</Typography>
      <Divider flexItem />
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>{children}</Box>
    </Stack>
  );
};
