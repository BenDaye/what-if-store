import { CollapseList } from '@/components/common';
import { useDashboardProviders } from '@/hooks';
import { ProviderListInputSchema } from '@/server/schemas';
import { List, ListProps } from '@mui/material';
import { ProviderType } from '@prisma/client';
import { useTranslation } from 'next-i18next';
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

  const { t } = useTranslation('provider');
  const primaryText = t(`Type.${type}`, type);

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
