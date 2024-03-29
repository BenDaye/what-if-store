import { useDashboardUser } from '@/hooks';
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

type UserListItemButtonProps = ListItemButtonProps & {
  itemId: IdSchema;
};

export const UserListItemButton = ({
  itemId,
  ...props
}: UserListItemButtonProps) => {
  const { avatarSrc, avatarText, nickname, bio, error, isError } =
    useDashboardUser(itemId);

  const { pathname, query, push } = useRouter();
  const selected = useMemo(
    () => pathname === '/dashboard/user/[id]' && query?.id === itemId,
    [itemId, pathname, query?.id],
  );

  return (
    <ListItemButton
      dense
      selected={selected}
      onClick={() => push(`/dashboard/user/${itemId}`)}
      {...props}
    >
      <ListItemAvatar>
        <Avatar alt={`Avatar:${itemId}`} src={avatarSrc} variant="rounded">
          {avatarText}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={nickname}
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
