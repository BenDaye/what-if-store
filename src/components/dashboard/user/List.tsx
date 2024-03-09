import { CollapseList } from '@/components/common';
import { useDashboardUsers } from '@/hooks';
import { UserListInputSchema } from '@/server/schemas';
import { List, ListProps } from '@mui/material';
import { AuthRole } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { UserListItemButton } from './ListItemButton';

type UserListProps = ListProps & { input?: UserListInputSchema };

export const UserList = ({ input, ...props }: UserListProps) => {
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
      {Object.values(AuthRole).map((role) => (
        <UserCollapseList key={role} role={role} input={input} />
      ))}
    </List>
  );
};

type UserCollapseListProps = {
  input?: UserListInputSchema;
  role: AuthRole;
};
const UserCollapseList = ({ role, input }: UserCollapseListProps) => {
  const { flattedData } = useDashboardUsers(true, {
    ...input,
    role: [role],
  });

  const { t } = useTranslation('user');
  const primaryText = t(`Role.${role}`, role);

  return (
    <CollapseList
      localStorageKey={`user-role:${role}`}
      primaryText={primaryText}
      secondaryText={`(${flattedData.length})`}
      defaultExpandMore={true}
    >
      {flattedData.map((item) => (
        <UserListItemButton key={item.id} itemId={item.id} />
      ))}
    </CollapseList>
  );
};
