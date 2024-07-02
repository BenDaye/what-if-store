import { useDashboardApplicationsWithPagination } from '@/hooks';
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
// import { ApplicationCategory, ApplicationStatus } from '@what-if-store/prisma/client';
import currency from 'currency.js';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import type { RouterOutput } from '@what-if-store/server/next/trpc';
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

type RowModel = RouterOutput['protectedDashboardApplication']['list']['items'][number];

export const ApplicationDataGrid = ({ overrides }: ApplicationDataGridProps) => {
  const { t } = useTranslation();
  const {
    router: { isFetching },
    items,
    total,
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
      headerName: t('application:DataGridHeaderName.Name'),
      flex: 4,
      renderCell: ({ row }) => <ApplicationIdRenderCell applicationId={row.id} />,
    },
    {
      field: 'providerId',
      headerName: t('application:DataGridHeaderName.Provider'),
      flex: 3,
      renderCell: ({ value }) => <ProviderIdRenderCell providerId={value} />,
    },
    {
      field: 'category',
      headerName: t('application:DataGridHeaderName.Category'),
      flex: 2,
      valueFormatter: ({ value }) => t(`application:Category.Name.${value}`),
      // editable: true,
      // type: 'singleSelect',
      // valueOptions: () =>
      //   Object.values(ApplicationCategory).map((category) => ({
      //     value: category,
      //     label: t(`application:Category.Name.${value}`),
      //   })),
    },
    {
      field: 'status',
      headerName: t('application:DataGridHeaderName.Status'),
      flex: 2,
      valueFormatter: ({ value }) => t(`application:Status.Text.${value}`),
      // editable: true,
      // type: 'singleSelect',
      // valueOptions: () =>
      //   Object.values(ApplicationStatus).map((status) => ({
      //     value: status,
      //     label: t(`application:Status.Text.${value}`),
      //   })),
    },
    {
      field: 'price',
      headerName: t('application:DataGridHeaderName.Price'),
      flex: 1,
      type: 'number',
      valueFormatter: ({ value }) => currency(value),
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
  const onProcessRowUpdateError = useCallback((error: unknown) => {
    // TODO: implement error handling
    console.error(error);
  }, []);
  return (
    <Card {...overrides?.CardProps}>
      <CardHeader
        title={t('application:_')}
        titleTypographyProps={{
          variant: 'subtitle1',
        }}
        action={
          <Button startIcon={<CreateIcon />} href="/dashboard/application/create">
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
