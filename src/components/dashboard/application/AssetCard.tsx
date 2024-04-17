import { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import {
  DeleteForever as RemoveIcon,
  AttachFile as ReplaceIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from '@mui/material';
import { ApplicationAssetType } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { default as NextImage } from 'next/image';
import { useEffect, useState } from 'react';

type AssetCardProps = OverridesCardProps & {
  asset?: UseDashboardApplicationHookDataSchema['assets'][number];
};
export const AssetCard = ({ asset, overrides }: AssetCardProps) => {
  const { t } = useTranslation();

  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!asset) return;
    const img = new Image();
    img.src = asset.url;
    img.onload = () => {
      setSize({ width: img.width, height: img.height });
    };
  }, [asset]);

  if (!asset) return null;
  return (
    <Card {...overrides?.CardProps}>
      <Box sx={{ height: 128, position: 'relative' }}>
        <NextImage
          alt={asset.type}
          src={asset.url}
          fill
          sizes={'(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 320px'}
          priority
          style={{ objectFit: 'contain' }}
        />
      </Box>
      <CardContent sx={{ pb: 0 }} {...overrides?.CardContentProps}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          {t(`application:Asset.Type.${asset.url}`)}
          {asset.type === ApplicationAssetType.Screenshot && asset.name
            ? `-${asset.name}`
            : ''}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          {`${width} x ${height}`}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ justifyContent: 'center' }}
        {...overrides?.CardActionsProps}
      >
        <IconButton>
          <ReplaceIcon />
        </IconButton>
        <IconButton>
          <RemoveIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
