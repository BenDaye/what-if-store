import { useDashboardApplicationGroup } from '@/hooks';
import type { OverridesProps } from '@/types/overrides';
import type { LinkProps } from '@mui/material';
import { Link } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { useBoolean } from 'usehooks-ts';
import { ApplicationGroupType } from '@what-if-store/prisma/client';
import type { RouterOutput } from '@what-if-store/server/react/trpc';
import { ApplicationGroupDialog } from './Dialog';

type RowModel = RouterOutput['protectedDashboardApplicationGroup']['list']['items'][number];

type ApplicationGroupNameRenderCellProps = OverridesProps<{
  LinkProps?: LinkProps;
}> & {
  row: RowModel;
};

export const ApplicationGroupNameRenderCell = ({ row, overrides }: ApplicationGroupNameRenderCellProps) => {
  const { t } = useTranslation();
  const name = useMemo(
    () => (row.type === ApplicationGroupType.Temporary ? row.name : t(`application:Group.Name.${row.name}`)),
    [row, t],
  );

  const {
    value: groupDialogVisible,
    setTrue: openGroupDialog,
    setFalse: closeGroupDialog,
  } = useBoolean(false);

  const { data } = useDashboardApplicationGroup(row.id);

  return (
    <>
      <Link onClick={openGroupDialog} {...overrides?.LinkProps}>
        {name}
      </Link>

      <ApplicationGroupDialog
        DialogProps={{
          open: groupDialogVisible,
          onClose: closeGroupDialog,
        }}
        defaultValues={data}
        mutationType="update"
      />
    </>
  );
};
