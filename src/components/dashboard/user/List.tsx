import { UserListInputSchema } from '@/server/schemas';
import { trpc } from '@/utils/trpc';
import { List, ListProps } from '@mui/material';
import { Fragment } from 'react';
import { UserListItemButton } from './ListItemButton';

type UserListProps = ListProps & { UserListProps?: UserListInputSchema };

export const UserList = ({ UserListProps, ...props }: UserListProps) => {
  const { data, refetch } = trpc.protectedDashboardUser.list.useInfiniteQuery(
    { ...UserListProps },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  trpc.protectedDashboardUser.subscribe.useSubscription(undefined, {
    onData: () => refetch(),
  });

  return (
    <List
      {...props}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        overflow: 'hidden',
        ...props?.sx,
      }}
    >
      {data?.pages.map((page, pageIndex) => (
        <Fragment key={pageIndex}>
          {page.items.map((item) => (
            <UserListItemButton key={item.id} itemId={item.id} />
          ))}
        </Fragment>
      ))}
    </List>
  );
};
