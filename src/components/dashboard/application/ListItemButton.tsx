import { useDashboardApplication } from '@/hooks';
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

type ApplicationListItemButtonProps = ListItemButtonProps & {
  itemId: IdSchema;
};

export const ApplicationListItemButton = ({
  itemId,
  ...props
}: ApplicationListItemButtonProps) => {
  const { avatarSrc, avatarText, name, description, author, error, isError } =
    useDashboardApplication(itemId);

  const { pathname, query, push } = useRouter();
  const selected = useMemo(
    () => pathname === '/dashboard/application/[id]' && query?.id === itemId,
    [itemId, pathname, query?.id],
  );

  return (
    <ListItemButton
      dense
      selected={selected}
      onClick={() => push(`/dashboard/application/${itemId}`)}
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
        secondary={isError ? error?.message : author?.name ?? description}
        secondaryTypographyProps={{
          noWrap: true,
          textOverflow: 'ellipsis',
          color: isError ? 'error' : 'text.secondary',
        }}
      />
    </ListItemButton>
  );
};
