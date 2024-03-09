import { CollapseList } from '@/components/common';
import { useDashboardApplications } from '@/hooks';
import { ApplicationListInputSchema } from '@/server/schemas';
import { List, ListProps } from '@mui/material';
import { ApplicationCategory } from '@prisma/client';
import { useTranslation } from 'next-i18next';
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
        <ApplicationCollapseList
          key={category}
          category={category}
          input={input}
        />
      ))}
    </List>
  );
};

type ApplicationCollapseListProps = {
  input?: ApplicationListInputSchema;
  category: ApplicationCategory;
};
const ApplicationCollapseList = ({
  category,
  input,
}: ApplicationCollapseListProps) => {
  const { flattedData } = useDashboardApplications(true, {
    ...input,
    category: [category],
  });

  const { t } = useTranslation('application');
  const primaryText = t(`Category.${category}`, category);

  return (
    <CollapseList
      localStorageKey={`application-category:${category}`}
      primaryText={primaryText}
      secondaryText={`(${flattedData.length})`}
      defaultExpandMore={false}
    >
      {flattedData.map((item) => (
        <ApplicationListItemButton key={item.id} itemId={item.id} />
      ))}
    </CollapseList>
  );
};
