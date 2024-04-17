import { useDashboardApplicationGroup } from '@/hooks';
import { OverridesProps } from '@/types/overrides';
import { RouterOutput } from '@/utils/trpc';
import { Link, LinkProps } from '@mui/material';
import { ApplicationGroupType } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import { useBoolean } from 'usehooks-ts';
import { ApplicationGroupDialog } from './Dialog';

type RowModel =
  RouterOutput['protectedDashboardApplicationGroup']['list']['items'][number];

type ApplicationGroupNameRenderCellProps = OverridesProps<{
  LinkProps?: LinkProps;
}> & {
  row: RowModel;
};

export const ApplicationGroupNameRenderCell = ({
  row,
  overrides,
}: ApplicationGroupNameRenderCellProps) => {
  const { t } = useTranslation();
  const name = useMemo(
    () =>
      row.type === ApplicationGroupType.Temporary
        ? row.name
        : t(`application:Group.Name.${row.name}`),
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
