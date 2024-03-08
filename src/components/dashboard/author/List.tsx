import { CollapseList } from '@/components/common';
import { useDashboardAuthors } from '@/hooks';
import { AuthorListInputSchema } from '@/server/schemas';
import { List, ListProps } from '@mui/material';
import { AuthorType } from '@prisma/client';
import { AuthorListItemButton } from './ListItemButton';

type AuthorListProps = ListProps & { input?: AuthorListInputSchema };

export const AuthorList = ({ input, ...props }: AuthorListProps) => {
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
      {Object.values(AuthorType).map((type) => (
        <AuthorCollapseList key={type} type={type} input={input} />
      ))}
    </List>
  );
};

type AuthorCollapseListProps = {
  input?: AuthorListInputSchema;
  type: AuthorType;
};
const AuthorCollapseList = ({ type, input }: AuthorCollapseListProps) => {
  const { flattedData } = useDashboardAuthors(true, {
    ...input,
    type: [type],
  });

  return (
    <CollapseList
      localStorageKey={`author-type:${type}`}
      primaryText={type}
      secondaryText={`(${flattedData.length})`}
      defaultExpandMore={true}
    >
      {flattedData.map((item) => (
        <AuthorListItemButton key={item.id} itemId={item.id} />
      ))}
    </CollapseList>
  );
};
