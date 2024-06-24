import { useAppUserApiKeysWithPagination, useDashboardUserApiKeysWithPagination, useNotice } from '@/hooks';
import type { OverridesProps } from '@/types/overrides';
import { createdAtColumn, idColumn, updatedAtColumn } from '@/utils/dataGridColumn';
import type { RouterOutput } from '@/utils/trpc';
import { DeleteForever as RemoveIcon } from '@mui/icons-material';
import type { CardContentProps, CardHeaderProps, CardProps } from '@mui/material';
import type {
  DataGridProps,
  GridColDef,
  GridFilterModel,
  GridRowParams,
  GridSortModel,
} from '@mui/x-data-grid';
import { DataGrid, GridActionsCellItem, zhCN } from '@mui/x-data-grid';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo } from 'react';
import { trpc } from '@what-if-store/server/react/trpc';

type ApiKeyDataGridProps = OverridesProps<{
  DataGridProps?: DataGridProps;
  CardProps?: CardProps;
  CardHeaderProps?: CardHeaderProps;
  CardContentProps?: CardContentProps;
}>;

type AppRowModel = RouterOutput['protectedAppUserApiKey']['list']['items'][number];
type DashboardRowModel = RouterOutput['protectedDashboardUserApiKey']['list']['items'][number];

export const ApiKeyDataGrid = ({ overrides }: ApiKeyDataGridProps) => {
  const { data: session } = useSession();
  const isUser = useMemo(
    () => session?.user?.role === AuthRole.User || session?.user?.role === AuthRole.Provider,
    [session?.user?.role],
  );
  const isAdmin = useMemo(() => session?.user?.role === AuthRole.Admin, [session?.user?.role]);

  if (isUser) return <AppApiKeyDataGrid overrides={overrides} />;
  if (isAdmin) return <DashboardApiKeyDataGrid overrides={overrides} />;
  return null;
};

const AppApiKeyDataGrid = ({ overrides }: ApiKeyDataGridProps) => {
  const { t } = useTranslation();
  const {
    router: { isFetching },
    items,
    total,
    pagination: { page, pageSize, setPaginationModel },
  } = useAppUserApiKeysWithPagination();
  const { showError } = useNotice();
  const { mutateAsync: remove } = trpc.protectedAppUserApiKey.removeById.useMutation({
    onError: (err) => showError(err.message),
  });

  const setFilterModel = useCallback((filterMode: GridFilterModel) => {
    // TODO: implement filter
    console.log(filterMode);
  }, []);
  const setSortModel = useCallback((sortModel: GridSortModel) => {
    // TODO: implement sort
    console.log(sortModel);
  }, []);
  const columns: GridColDef<DashboardRowModel>[] = [
    {
      field: 'id',
      ...idColumn,
    },
    {
      field: 'key',
      headerName: t('auth:ApiKey.DataGridHeaderName.Key'),
      flex: 4,
    },
    {
      field: 'remark',
      headerName: t('auth:ApiKey.DataGridHeaderName.Remark'),
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: t('common:DataGridHeaderName.CreatedAt'),
      ...createdAtColumn,
      headerAlign: 'right',
      align: 'right',
    },
    {
      field: 'updatedAt',
      headerName: t('common:DataGridHeaderName.UpdatedAt'),
      ...updatedAtColumn,
      headerAlign: 'right',
      align: 'right',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('common:DataGridHeaderName.Actions'),
      headerAlign: 'right',
      align: 'right',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="delete"
          label={t('common:Remove')}
          icon={<RemoveIcon />}
          showInMenu={false}
          onClick={() => remove(params.row.id)}
        />,
      ],
    },
  ];
  const processRowUpdate = useCallback(
    (updatedRow: AppRowModel, originalRow: AppRowModel): Promise<AppRowModel> | AppRowModel => {
      // TODO: implement update
      console.log(updatedRow, originalRow);
      return originalRow;
    },
    [],
  );
  const onProcessRowUpdateError = useCallback((error: any) => {
    // TODO: implement error handling
    console.error(error);
  }, []);
  return (
    <DataGrid
      disableRowSelectionOnClick
      initialState={{
        pagination: { paginationModel: { page, pageSize } },
        columns: {
          columnVisibilityModel: {
            id: false,
            createdAt: true,
            updatedAt: false,
          },
        },
      }}
      columns={columns}
      rows={items}
      rowCount={total}
      loading={isFetching}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      pageSizeOptions={[20, 50, 100]}
      paginationMode="server"
      onPaginationModelChange={setPaginationModel}
      filterMode="server"
      onFilterModelChange={setFilterModel}
      sortingMode="server"
      onSortModelChange={setSortModel}
      editMode="row"
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={onProcessRowUpdateError}
      {...overrides?.DataGridProps}
    />
  );
};

const DashboardApiKeyDataGrid = ({ overrides }: ApiKeyDataGridProps) => {
  const { t } = useTranslation();
  const {
    router: { isFetching },
    items,
    total,
    pagination: { page, pageSize, setPaginationModel },
  } = useDashboardUserApiKeysWithPagination();
  const { showError } = useNotice();
  const { mutateAsync: remove } = trpc.protectedDashboardUserApiKey.removeById.useMutation({
    onError: (err) => showError(err.message),
  });

  const setFilterModel = useCallback((filterMode: GridFilterModel) => {
    // TODO: implement filter
    console.log(filterMode);
  }, []);
  const setSortModel = useCallback((sortModel: GridSortModel) => {
    // TODO: implement sort
    console.log(sortModel);
  }, []);
  const columns: GridColDef<DashboardRowModel>[] = [
    {
      field: 'id',
      ...idColumn,
    },
    {
      field: 'key',
      headerName: t('auth:ApiKey.DataGridHeaderName.Key'),
      flex: 4,
      valueFormatter: () => `********-****-****-****-************`,
    },
    {
      field: 'remark',
      headerName: t('auth:ApiKey.DataGridHeaderName.Remark'),
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: t('common:DataGridHeaderName.CreatedAt'),
      ...createdAtColumn,
      headerAlign: 'right',
      align: 'right',
    },
    {
      field: 'updatedAt',
      headerName: t('common:DataGridHeaderName.UpdatedAt'),
      ...updatedAtColumn,
      headerAlign: 'right',
      align: 'right',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('common:DataGridHeaderName.Actions'),
      headerAlign: 'right',
      align: 'right',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="delete"
          label={t('common:Remove')}
          icon={<RemoveIcon />}
          showInMenu={false}
          onClick={() => remove(params.row.id)}
        />,
      ],
    },
  ];
  const processRowUpdate = useCallback(
    (
      updatedRow: DashboardRowModel,
      originalRow: DashboardRowModel,
    ): Promise<DashboardRowModel> | DashboardRowModel => {
      // TODO: implement update
      console.log(updatedRow, originalRow);
      return originalRow;
    },
    [],
  );
  const onProcessRowUpdateError = useCallback((error: any) => {
    // TODO: implement error handling
    console.error(error);
  }, []);
  return (
    <DataGrid
      disableRowSelectionOnClick
      initialState={{
        pagination: { paginationModel: { page, pageSize } },
        columns: {
          columnVisibilityModel: {
            id: false,
            createdAt: true,
            updatedAt: false,
          },
        },
      }}
      columns={columns}
      rows={items}
      rowCount={total}
      loading={isFetching}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      pageSizeOptions={[20, 50, 100]}
      paginationMode="server"
      onPaginationModelChange={setPaginationModel}
      filterMode="server"
      onFilterModelChange={setFilterModel}
      sortingMode="server"
      onSortModelChange={setSortModel}
      editMode="row"
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={onProcessRowUpdateError}
      {...overrides?.DataGridProps}
    />
  );
};
