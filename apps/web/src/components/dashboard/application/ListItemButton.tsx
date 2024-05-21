import { useDashboardApplication } from '@/hooks';
import type { IdSchema } from '@/server/schemas';
import type { ListItemButtonProps } from '@mui/material';
import { Avatar, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

type ApplicationListItemButtonProps = ListItemButtonProps & {
  itemId: IdSchema;
};

export const ApplicationListItemButton = ({ itemId, ...props }: ApplicationListItemButtonProps) => {
  const {
    router: { error, isError },
    data: { name, description, provider, primaryIcon, primaryIconText },
  } = useDashboardApplication(itemId);

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
        <Avatar alt={`Avatar:${itemId}`} src={primaryIcon?.url} variant="rounded">
          {primaryIconText}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={name}
        primaryTypographyProps={{
          noWrap: true,
          textOverflow: 'ellipsis',
        }}
        secondary={isError ? error?.message : description ?? provider?.id}
        secondaryTypographyProps={{
          noWrap: true,
          textOverflow: 'ellipsis',
          color: isError ? 'error' : 'text.secondary',
        }}
      />
    </ListItemButton>
  );
};
