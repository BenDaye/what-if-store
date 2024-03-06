import { IdSchema } from '@/server/schemas';
import { trpc } from '@/utils/trpc';
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemButtonProps,
  ListItemText,
} from '@mui/material';

type UserListItemButtonProps = ListItemButtonProps & {
  itemId: IdSchema;
};

export const UserListItemButton = ({
  itemId,
  ...props
}: UserListItemButtonProps) => {
  const { data, refetch, error, isError } =
    trpc.protectedDashboardUser.getProfileById.useQuery(itemId);

  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
    onData: (_itemId) => _itemId === itemId && refetch(),
  });

  return (
    <ListItemButton {...props}>
      <ListItemAvatar>
        <Avatar
          alt={`Avatar:${itemId}`}
          src={
            data?.Author?.AuthorProfile?.avatar ||
            data?.UserProfile?.avatar ||
            undefined
          }
          variant="rounded"
        >
          {data?.Author?.name?.charAt(0) ??
            data?.UserProfile?.nickname?.charAt(0) ??
            data?.username?.charAt(0)}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          data?.Author?.name ?? data?.UserProfile?.nickname ?? data?.username
        }
        primaryTypographyProps={{
          noWrap: true,
          textOverflow: 'ellipsis',
        }}
        secondary={
          isError
            ? error.message
            : data?.Author?.AuthorProfile?.bio ?? data?.UserProfile?.bio ?? '-'
        }
        secondaryTypographyProps={{
          noWrap: true,
          textOverflow: 'ellipsis',
          color: isError ? 'error' : 'text.secondary',
        }}
      />
    </ListItemButton>
  );
};
