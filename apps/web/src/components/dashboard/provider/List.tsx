import { CollapseList } from '@/components/common';
import { useDashboardProviders } from '@/hooks';
import type { ListProps } from '@mui/material';
import { List } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { ProviderType } from '@what-if-store/prisma/client';
import type { ProviderListInputSchema } from '@what-if-store/server/server/schemas';
import { ProviderListItemButton } from './ListItemButton';

type ProviderListProps = ListProps & { input?: ProviderListInputSchema };

export const ProviderList = ({ input, ...props }: ProviderListProps) => {
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
      {Object.values(ProviderType).map((type) => (
        <ProviderCollapseList key={type} type={type} input={input} />
      ))}
    </List>
  );
};

type ProviderCollapseListProps = {
  input?: ProviderListInputSchema;
  type: ProviderType;
};
const ProviderCollapseList = ({ type, input }: ProviderCollapseListProps) => {
  const { data } = useDashboardProviders({
    ...input,
    type: [type],
  });

  const { t } = useTranslation();
  const primaryText = t(`provider:Type.${type}`, type);

  return (
    <CollapseList
      localStorageKey={`provider-type:${type}`}
      primaryText={primaryText}
      secondaryText={`${data.length}`}
      defaultExpandMore={true}
    >
      {data.map((item) => (
        <ProviderListItemButton key={item.id} itemId={item.id} />
      ))}
    </CollapseList>
  );
};
