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
  const {
    router: { error, isError },
    data: { name, description, provider, primaryIconSrc, primaryIconText },
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
        <Avatar alt={`Avatar:${itemId}`} src={primaryIconSrc} variant="rounded">
          {primaryIconText}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={name}
        primaryTypographyProps={{
          noWrap: true,
          textOverflow: 'ellipsis',
        }}
        secondary={isError ? error?.message : provider?.id ?? description}
        secondaryTypographyProps={{
          noWrap: true,
          textOverflow: 'ellipsis',
          color: isError ? 'error' : 'text.secondary',
        }}
      />
    </ListItemButton>
  );
};
