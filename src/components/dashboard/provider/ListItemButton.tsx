import { useDashboardProvider } from '@/hooks';
import { IdSchema } from '@/server/schemas';
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemButtonProps,
  ListItemText,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

type ProviderListItemButtonProps = ListItemButtonProps & {
  itemId: IdSchema;
};

export const ProviderListItemButton = ({
  itemId,
  ...props
}: ProviderListItemButtonProps) => {
  const { avatarSrc, avatarText, name, bio, error, isError } =
    useDashboardProvider(itemId);

  const { pathname, query, push } = useRouter();
  const selected = useMemo(
    () => pathname === '/dashboard/provider/[id]' && query?.id === itemId,
    [itemId, pathname, query?.id],
  );

  return (
    <ListItemButton
      dense
      selected={selected}
      onClick={() => push(`/dashboard/provider/${itemId}`)}
      {...props}
    >
      <ListItemAvatar>
        <Avatar alt={`Avatar:${itemId}`} src={avatarSrc} variant="rounded">
          {avatarText}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={name}
        primaryTypographyProps={{
          noWrap: true,
          textOverflow: 'ellipsis',
        }}
        secondary={isError ? error?.message : bio}
        secondaryTypographyProps={{
          noWrap: true,
          textOverflow: 'ellipsis',
          color: isError ? 'error' : 'text.secondary',
        }}
      />
    </ListItemButton>
  );
};
