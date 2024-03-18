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
import { ApplicationCategory, ApplicationStatus } from '@prisma/client';
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

type RowModel =
  RouterOutput['protectedDashboardApplication']['list']['items'][number];

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
  const columns: GridColDef<RowModel>[] = [
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
      renderCell: ({ value }) => <ProviderIdRenderCell providerId={value} />,
    },
    {
      field: 'category',
      headerName: tApplication('DataGridHeaderName.Category', 'Category'),
      flex: 2,
      valueFormatter: ({ value }) => tApplication(`Category.${value}`, value),
      editable: true,
      type: 'singleSelect',
      valueOptions: () =>
        Object.values(ApplicationCategory).map((category) => ({
          value: category,
          label: tApplication(`Category.${category}`, category),
        })),
    },
    {
      field: 'status',
      headerName: tApplication('DataGridHeaderName.Status', 'Status'),
      flex: 2,
      valueFormatter: ({ value }) => tApplication(`Status.${value}`, value),
      editable: true,
      type: 'singleSelect',
      valueOptions: () =>
        Object.values(ApplicationStatus).map((status) => ({
          value: status,
          label: tApplication(`Status.${status}`, status),
        })),
    },
    {
      field: 'price',
      headerName: tApplication('DataGridHeaderName.Price', 'Price'),
      flex: 1,
      type: 'number',
      valueFormatter: ({ value }) => currency(value),
    },
  ];
  const processRowUpdate = useCallback(
    (
      updatedRow: RowModel,
      originalRow: RowModel,
    ): Promise<RowModel> | RowModel => {
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
          editMode="row"
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={onProcessRowUpdateError}
          {...overrides?.DataGridProps}
        />
      </CardContent>
    </Card>
  );
};
