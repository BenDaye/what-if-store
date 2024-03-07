import { CollapseList } from '@/components/common';
import { useDashboardAuthors } from '@/hooks';
import { AuthorListInputSchema } from '@/server/schemas';
import { List, ListProps } from '@mui/material';
import { AuthorType } from '@prisma/client';
import { AuthorListItemButton } from './ListItemButton';

type AuthorListProps = ListProps & { input?: AuthorListInputSchema };

export const AuthorList = ({ input, ...props }: AuthorListProps) => {
  const { flattedData: independentDevelopers } = useDashboardAuthors(true, {
    ...input,
    limit: input?.limit ?? 20,
    type: [AuthorType.IndependentDeveloper],
  });
  const { flattedData: companies } = useDashboardAuthors(true, {
    ...input,
    limit: input?.limit ?? 20,
    type: [AuthorType.Company],
  });
  const { flattedData: communities } = useDashboardAuthors(true, {
    ...input,
    limit: input?.limit ?? 20,
    type: [AuthorType.Community],
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
      <CollapseList
        primaryText={`independent developers`}
        secondaryText={`(${independentDevelopers.length})`}
      >
        {independentDevelopers.map((item) => (
          <AuthorListItemButton key={item.id} itemId={item.id} />
        ))}
      </CollapseList>
      <CollapseList
        primaryText={`companies`}
        secondaryText={`(${companies.length})`}
      >
        {companies.map((item) => (
          <AuthorListItemButton key={item.id} itemId={item.id} />
        ))}
      </CollapseList>
      <CollapseList
        primaryText={`communities`}
        secondaryText={`(${communities.length})`}
      >
        {communities.map((item) => (
          <AuthorListItemButton key={item.id} itemId={item.id} />
        ))}
      </CollapseList>
    </List>
  );
};
