import { useDashboardApplicationsWithPagination } from '@/hooks';
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
import currency from 'currency.js';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import { IdRenderCell as ProviderIdRenderCell } from '../provider/IdRenderCell';
import { IdRenderCell as ApplicationIdRenderCell } from './IdRenderCell';

type ApplicationDataGridProps = {
  overrides?: {
    DataGridProps?: DataGridProps;
    CardProps?: CardProps;
    CardHeaderProps?: CardHeaderProps;
    CardContentProps?: CardContentProps;
  };
};

export const ApplicationDataGrid = ({
  overrides,
}: ApplicationDataGridProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tApplication } = useTranslation('application');
  const {
    items,
    total,
    isFetching,
    pagination: { page, pageSize, setPaginationModel },
  } = useDashboardApplicationsWithPagination();
  const setFilterModel = useCallback((filterMode: GridFilterModel) => {
    // TODO: implement filter
    console.log(filterMode);
  }, []);
  const setSortModel = useCallback((sortModel: GridSortModel) => {
    // TODO: implement sort
    console.log(sortModel);
  }, []);
  const columns: GridColDef<
    RouterOutput['protectedDashboardApplication']['list']['items'][number]
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
      headerName: tApplication('DataGridHeaderName.Name', 'Name'),
      flex: 4,
      renderCell: ({ row }) => (
        <ApplicationIdRenderCell applicationId={row.id} />
      ),
    },
    {
      field: 'providerId',
      headerName: tApplication('DataGridHeaderName.Provider', 'Provider'),
      flex: 3,
      editable: false,
      renderCell: ({ value }) => <ProviderIdRenderCell providerId={value} />,
    },
    {
      field: 'category',
      headerName: tApplication('DataGridHeaderName.Category', 'Category'),
      flex: 2,
      valueFormatter: ({ value }) => tApplication(`Category.${value}`, value),
    },
    {
      field: 'status',
      headerName: tApplication('DataGridHeaderName.Status', 'Status'),
      flex: 2,
      valueFormatter: ({ value }) => tApplication(`Status.${value}`, value),
    },
    {
      field: 'price',
      headerName: tApplication('DataGridHeaderName.Price', 'Price'),
      flex: 1,
      type: 'number',
      valueFormatter: ({ value }) => currency(value),
    },
  ];
  return (
    <Card {...overrides?.CardProps}>
      <CardHeader title={tApplication('_')} {...overrides?.CardHeaderProps} />
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
