import { useDashboardApplicationGroupsWithPagination } from '@/hooks';
import { createdAtColumn, idColumn, updatedAtColumn } from '@/utils/dataGridColumn';
import type { CardContentProps, CardHeaderProps, CardProps } from '@mui/material';
import { Card, CardContent, CardHeader } from '@mui/material';
import type { DataGridProps, GridColDef, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import {
  DataGrid,
  // GridRowModel,
  GridToolbar,
  zhCN,
} from '@mui/x-data-grid';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import type { RouterOutput } from '@what-if-store/server/react/trpc';
import { ApplicationGroupCreateButton } from './CreateButton';
import { ApplicationGroupNameRenderCell } from './NameRenderCell';

type ApplicationGroupDataGridProps = {
  overrides?: {
    DataGridProps?: DataGridProps;
    CardProps?: CardProps;
    CardHeaderProps?: CardHeaderProps;
    CardContentProps?: CardContentProps;
  };
};

type RowModel = RouterOutput['protectedDashboardApplicationGroup']['list']['items'][number];

export const ApplicationGroupDataGrid = ({ overrides }: ApplicationGroupDataGridProps) => {
  const { t } = useTranslation();
  const {
    router: { isFetching },
    items,
    total,
    pagination: { page, pageSize, setPaginationModel },
  } = useDashboardApplicationGroupsWithPagination();
  const setFilterModel = useCallback((filterMode: GridFilterModel) => {
    // TODO: implement filter
    console.log(filterMode);
  }, []);
  const setSortModel = useCallback((sortModel: GridSortModel) => {
    // TODO: implement sort
    console.log(sortModel);
  }, []);
  const columns: GridColDef<RowModel>[] = [
    {
      field: 'id',
      ...idColumn,
    },
    {
      field: 'createdAt',
      headerName: t('common:DataGridHeaderName.CreatedAt'),
      ...createdAtColumn,
    },
    {
      field: 'updatedAt',
      headerName: t('common:DataGridHeaderName.UpdatedAt'),
      ...updatedAtColumn,
    },
    {
      field: 'name',
      headerName: t('application:DataGridHeaderName.Group.Name'),
      flex: 3,
      renderCell: ({ row }) => <ApplicationGroupNameRenderCell row={row} />,
    },
    {
      field: 'type',
      headerName: t('application:DataGridHeaderName.Group.Type'),
      flex: 1,
      valueFormatter: ({ value }) => t(`application:Group.Type.${value}`),
      // type: 'singleSelect',
      // valueOptions: () =>
      //   Object.values(ApplicationGroupType).map((value) => ({
      //     value,
      //     label: t(`application:Group.Type.${value}`, value),
      //   })),
    },
    {
      field: 'description',
      headerName: t('application:DataGridHeaderName.Group.Description'),
      flex: 2,
    },
    {
      field: '_count.Applications',
      headerName: t('application:DataGridHeaderName.Group.Count.Application'),
      flex: 1,
      type: 'number',
      valueGetter: (params) => params.row._count.Applications,
    },
  ];
  const processRowUpdate = useCallback(
    (updatedRow: RowModel, originalRow: RowModel): Promise<RowModel> | RowModel => {
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
    <Card {...overrides?.CardProps}>
      <CardHeader
        title={t('application:Group._')}
        titleTypographyProps={{
          variant: 'subtitle1',
        }}
        action={<ApplicationGroupCreateButton />}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { page, pageSize } },
            columns: {
              columnVisibilityModel: {
                id: false,
                createdAt: false,
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
      </CardContent>
    </Card>
  );
};
