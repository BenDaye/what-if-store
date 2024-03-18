import { useDashboardApplicationTagsWithPagination } from '@/hooks';
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

type ApplicationTagDataGridProps = {
  overrides?: {
    DataGridProps?: DataGridProps;
    CardProps?: CardProps;
    CardHeaderProps?: CardHeaderProps;
    CardContentProps?: CardContentProps;
  };
};

type RowModel =
  RouterOutput['protectedDashboardApplicationTag']['list']['items'][number];

export const ApplicationTagDataGrid = ({
  overrides,
}: ApplicationTagDataGridProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tApplication } = useTranslation('application');
  const {
    items,
    total,
    isFetching,
    pagination: { page, pageSize, setPaginationModel },
  } = useDashboardApplicationTagsWithPagination();
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
      headerName: tApplication('DataGridHeaderName.Tag.Name', 'Name'),
      flex: 2,
    },
    {
      field: '_count.applications',
      headerName: tApplication(
        'DataGridHeaderName.Tag.Count.Application',
        'Applications',
      ),
      flex: 1,
      type: 'number',
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
      <CardHeader
        title={tApplication('Tag._')}
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
