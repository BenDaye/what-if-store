import { CollapseList } from '@/components/common';
import { useDashboardApplications } from '@/hooks';
import type { ListProps } from '@mui/material';
import { List } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { ApplicationCategory } from '@what-if-store/prisma/client';
import type { ApplicationListInputSchema } from '@what-if-store/server/server/schemas';
import { ApplicationListItemButton } from './ListItemButton';

type ApplicationListProps = ListProps & { input?: ApplicationListInputSchema };

export const ApplicationList = ({ input, ...props }: ApplicationListProps) => {
  return (
    <List
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
      {...props}
    >
      {Object.values(ApplicationCategory).map((category) => (
        <ApplicationCollapseList key={category} category={category} input={input} />
      ))}
    </List>
  );
};

type ApplicationCollapseListProps = {
  input?: ApplicationListInputSchema;
  category: ApplicationCategory;
};
const ApplicationCollapseList = ({ category, input }: ApplicationCollapseListProps) => {
  const { data } = useDashboardApplications({
    ...input,
    category: [category],
  });

  const { t } = useTranslation();
  const primaryText = t(`application:Category.Name.${category}`);

  return (
    <CollapseList
      localStorageKey={`application-category:${category}`}
      primaryText={primaryText}
      secondaryText={`${data.length}`}
      defaultExpandMore={false}
    >
      {data.map((item) => (
        <ApplicationListItemButton key={item.id} itemId={item.id} />
      ))}
    </CollapseList>
  );
};
