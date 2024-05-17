import { PlaceholderBase64DataUrl } from '@/constants/image';
import {
  AppApplicationGroupRouterOutput,
  useAppApplication,
  useAppApplicationGroup,
  UseAppApplicationGroupsDataSchema,
} from '@/hooks';
import { Box, CardActionArea, useTheme } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { ApplicationCard } from '../Card';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

type RecommendSectionProps = {
  data: UseAppApplicationGroupsDataSchema[number];
};
export const RecommendSection = ({ data: { id } }: RecommendSectionProps) => {
  const {
    data: { applications },
  } = useAppApplicationGroup(id);
  const [currentAppIndex, setCurrentAppIndex] = useState(0);
  const theme = useTheme();
  return (
    <AutoPlaySwipeableViews
      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
      index={currentAppIndex}
      onChangeIndex={setCurrentAppIndex}
      enableMouseEvents
      interval={5000}
      autoplay={true}
    >
      {applications.map((item) => (
        <ApplicationView key={item.id} data={item}></ApplicationView>
      ))}
    </AutoPlaySwipeableViews>
  );
};

const ApplicationView = ({
  data: { id, name, providerId },
}: {
  data: AppApplicationGroupRouterOutput['Applications'][number];
}) => {
  const { data } = useAppApplication(id);
  return (
    <CardActionArea
      href={`/app/application/${id}`}
      sx={{ position: 'relative', height: 480 }}
    >
      <Image
        alt={name}
        fill
        src={data.primaryBackground?.url ?? '/images/placeholder.png'}
        placeholder="blur"
        blurDataURL={PlaceholderBase64DataUrl}
        sizes="100vw"
        style={{
          objectFit: 'cover',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: (theme) => theme.spacing(2),
          left: (theme) => theme.spacing(2),
          zIndex: 10,
          minWidth: 320,
        }}
      >
        <ApplicationCard
          data={{ id, name, providerId }}
          overrides={{
            CardProps: {
              sx: {
                backgroundColor: 'transparent',
                backgroundImage: (theme) =>
                  theme.palette.mode === 'dark'
                    ? `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.25))`
                    : `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.25))`,
                backdropFilter: 'blur(10px)',
              },
              elevation: 4,
            },
          }}
          mode="detailed"
        />
      </Box>
    </CardActionArea>
  );
};
