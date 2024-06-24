import { useDashboardApplicationCollectionsWithPagination } from '@/hooks';
import { createdAtColumn, idColumn, updatedAtColumn } from '@/utils/dataGridColumn';
import { AddBox as CreateIcon } from '@mui/icons-material';
import type { CardContentProps, CardHeaderProps, CardProps } from '@mui/material';
import { Button, Card, CardContent, CardHeader } from '@mui/material';
import type { DataGridProps, GridColDef, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import {
  DataGrid,
  // GridRowModel,
  GridToolbar,
  zhCN,
} from '@mui/x-data-grid';
import currency from 'currency.js';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import type { RouterOutput } from '@what-if-store/server/next/trpc';

type ApplicationCollectionDataGridProps = {
  overrides?: {
    DataGridProps?: DataGridProps;
    CardProps?: CardProps;
    CardHeaderProps?: CardHeaderProps;
    CardContentProps?: CardContentProps;
  };
};

type RowModel = RouterOutput['protectedDashboardApplicationCollection']['list']['items'][number];

export const ApplicationCollectionDataGrid = ({ overrides }: ApplicationCollectionDataGridProps) => {
  const { t } = useTranslation();
  const {
    router: { isFetching },
    items,
    total,
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
      headerName: t('application:DataGridHeaderName.Collection.Name'),
      flex: 4,
      editable: true,
    },
    {
      field: 'description',
      headerName: t('application:DataGridHeaderName.Collection.Description'),
      flex: 3,
      editable: true,
    },
    {
      field: 'price',
      headerName: t('application:DataGridHeaderName.Collection.Price'),
      flex: 1,
      type: 'number',
      valueFormatter: ({ value }) => currency(value),
    },
    {
      field: '_count.applications',
      headerName: t('application.DataGridHeaderName.Collection.Count.Application'),
      flex: 1,
      type: 'number',
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
        title={t('application:Collection._')}
        titleTypographyProps={{
          variant: 'subtitle1',
        }}
        action={
          <Button startIcon={<CreateIcon />} href="/dashboard/application_collection/create">
            {t('common:Create')}
          </Button>
        }
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
