import { useDashboardApplicationGroupsWithPagination } from '@/hooks';
import {
  createdAtColumn,
  idColumn,
  updatedAtColumn,
} from '@/utils/dataGridColumn';
import { RouterOutput } from '@/utils/trpc';
import {
  Card,
  CardContent,
  CardContentProps,
  CardHeader,
  CardHeaderProps,
  CardProps,
} from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridFilterModel,
  GridSortModel,
  // GridRowModel,
  GridToolbar,
  zhCN,
} from '@mui/x-data-grid';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';

type ApplicationGroupDataGridProps = {
  overrides?: {
    DataGridProps?: DataGridProps;
    CardProps?: CardProps;
    CardHeaderProps?: CardHeaderProps;
    CardContentProps?: CardContentProps;
  };
};

export const ApplicationGroupDataGrid = ({
  overrides,
}: ApplicationGroupDataGridProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tApplication } = useTranslation('application');
  const {
    items,
    total,
    isFetching,
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
  const columns: GridColDef<
    RouterOutput['protectedDashboardApplicationGroup']['list']['items'][number]
  >[] = [
    {
      field: 'id',
      ...idColumn,
    },
    {
      field: 'createdAt',
      headerName: tCommon('DataGridHeaderName.CreatedAt', 'CreatedAt'),
      ...createdAtColumn,
    },
    {
      field: 'updatedAt',
      headerName: tCommon('DataGridHeaderName.UpdatedAt', 'UpdatedAt'),
      ...updatedAtColumn,
    },
    {
      field: 'name',
      headerName: tApplication('DataGridHeaderName.Group.Name', 'Name'),
      flex: 4,
    },
    {
      field: 'type',
      headerName: tApplication('DataGridHeaderName.Group.Type', 'Type'),
      flex: 1,
    },
    {
      field: 'description',
      headerName: tApplication(
        'DataGridHeaderName.Group.Description',
        'Description',
      ),
      flex: 3,
      editable: false,
    },
    {
      field: '_count.applications',
      headerName: tApplication(
        'DataGridHeaderName.Group.Count.Application',
        'Applications',
      ),
      flex: 1,
      type: 'number',
    },
  ];
  return (
    <Card {...overrides?.CardProps}>
      <CardHeader
        title={tApplication('Group._')}
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
          {...overrides?.DataGridProps}
        />
      </CardContent>
    </Card>
  );
};
