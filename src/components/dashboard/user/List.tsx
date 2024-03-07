import { CollapseList } from '@/components/common';
import { useDashboardUsers } from '@/hooks';
import { UserListInputSchema } from '@/server/schemas';
import { List, ListProps } from '@mui/material';
import { AuthRole } from '@prisma/client';
import { UserListItemButton } from './ListItemButton';

type UserListProps = ListProps & { input?: UserListInputSchema };

export const UserList = ({ input, ...props }: UserListProps) => {
  const { flattedData: users } = useDashboardUsers(true, {
    ...input,
    limit: input?.limit ?? 20,
    role: [AuthRole.USER],
  });
  const { flattedData: authors } = useDashboardUsers(true, {
    ...input,
    limit: input?.limit ?? 20,
    role: [AuthRole.AUTHOR],
  });
  const { flattedData: admins } = useDashboardUsers(true, {
    ...input,
    limit: input?.limit ?? 20,
    role: [AuthRole.ADMIN],
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
      <CollapseList primaryText={`users`} secondaryText={`(${users.length})`}>
        {users.map((item) => (
          <UserListItemButton key={item.id} itemId={item.id} />
        ))}
      </CollapseList>
      <CollapseList
        primaryText={`authors`}
        secondaryText={`(${authors.length})`}
      >
        {authors.map((item) => (
          <UserListItemButton key={item.id} itemId={item.id} />
        ))}
      </CollapseList>
      <CollapseList primaryText={`admins`} secondaryText={`(${admins.length})`}>
        {admins.map((item) => (
          <UserListItemButton key={item.id} itemId={item.id} />
        ))}
      </CollapseList>
    </List>
  );
};
