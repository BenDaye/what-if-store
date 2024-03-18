import { useDashboardApplicationCollectionsWithPagination } from '@/hooks';
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

type ApplicationCollectionDataGridProps = {
  overrides?: {
    DataGridProps?: DataGridProps;
    CardProps?: CardProps;
    CardHeaderProps?: CardHeaderProps;
    CardContentProps?: CardContentProps;
  };
};

export const ApplicationCollectionDataGrid = ({
  overrides,
}: ApplicationCollectionDataGridProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tApplication } = useTranslation('application');
  const {
    items,
    total,
    isFetching,
    pagination: { page, pageSize, setPaginationModel },
  } = useDashboardApplicationCollectionsWithPagination();
  const setFilterModel = useCallback((filterMode: GridFilterModel) => {
    // TODO: implement filter
    console.log(filterMode);
  }, []);
  const setSortModel = useCallback((sortModel: GridSortModel) => {
    // TODO: implement sort
    console.log(sortModel);
  }, []);
  const columns: GridColDef<
    RouterOutput['protectedDashboardApplicationCollection']['list']['items'][number]
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
      headerName: tApplication('DataGridHeaderName.Collection.Name', 'Name'),
      flex: 4,
    },
    {
      field: 'description',
      headerName: tApplication(
        'DataGridHeaderName.Collection.Description',
        'Description',
      ),
      flex: 3,
      editable: false,
    },
    {
      field: '_count.applications',
      headerName: tApplication(
        'DataGridHeaderName.Collection.Count.Application',
        'Applications',
      ),
      flex: 1,
      type: 'number',
    },
    {
      field: 'price',
      headerName: tApplication('DataGridHeaderName.Collection.Price', 'Price'),
      flex: 1,
      type: 'number',
      valueFormatter: ({ value }) => currency(value),
    },
  ];
  return (
    <Card {...overrides?.CardProps}>
      <CardHeader
        title={tApplication('Collection._')}
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
