import { useDashboardApplicationsWithPagination } from '@/hooks';
import {
  createdAtColumn,
  idColumn,
  updatedAtColumn,
} from '@/utils/dataGridColumn';
import { RouterOutput } from '@/utils/trpc';
import { AddBox as CreateIcon } from '@mui/icons-material';
import {
  Button,
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
// import { ApplicationCategory, ApplicationStatus } from '@prisma/client';
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
  const { t: tApplicationCategoryName } = useTranslation('application', {
    keyPrefix: 'Category.Name',
  });
  const { t: tApplicationStatusText } = useTranslation('application', {
    keyPrefix: 'Status.Text',
  });
  const { t: tApplicationDataGridHeaderName } = useTranslation('application', {
    keyPrefix: 'DataGridHeaderName',
  });
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
      headerName: tApplicationDataGridHeaderName('Name', 'Name'),
      flex: 4,
      renderCell: ({ row }) => (
        <ApplicationIdRenderCell applicationId={row.id} />
      ),
    },
    {
      field: 'providerId',
      headerName: tApplicationDataGridHeaderName('Provider', 'Provider'),
      flex: 3,
      renderCell: ({ value }) => <ProviderIdRenderCell providerId={value} />,
    },
    {
      field: 'category',
      headerName: tApplicationDataGridHeaderName('Category', 'Category'),
      flex: 2,
      valueFormatter: ({ value }) => tApplicationCategoryName(value, value),
      // editable: true,
      // type: 'singleSelect',
      // valueOptions: () =>
      //   Object.values(ApplicationCategory).map((category) => ({
      //     value: category,
      //     label: tApplicationCategoryName(category, category),
      //   })),
    },
    {
      field: 'status',
      headerName: tApplicationDataGridHeaderName('Status', 'Status'),
      flex: 2,
      valueFormatter: ({ value }) => tApplicationStatusText(value, value),
      // editable: true,
      // type: 'singleSelect',
      // valueOptions: () =>
      //   Object.values(ApplicationStatus).map((status) => ({
      //     value: status,
      //     label: tApplicationStatusText(status, status),
      //   })),
    },
    {
      field: 'price',
      headerName: tApplicationDataGridHeaderName('Price', 'Price'),
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
      <CardHeader
        title={tApplication('_')}
        titleTypographyProps={{
          variant: 'subtitle1',
        }}
        action={
          <Button
            startIcon={<CreateIcon />}
            href="/dashboard/application/create"
          >
            {tCommon('Create')}
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
