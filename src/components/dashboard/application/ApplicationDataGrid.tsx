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
  CardHeader,
  TableContainerProps,
} from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  // GridRowModel,
  GridToolbar,
  zhCN,
} from '@mui/x-data-grid';
import { useTranslation } from 'next-i18next';

type ApplicationDataGridProps = {
  overrides?: {
    DataGridProps?: DataGridProps;
    TableContainerProps: TableContainerProps;
  };
};

export const ApplicationDataGrid = ({
  overrides,
}: ApplicationDataGridProps) => {
  const { t: tApplication } = useTranslation('application');
  const {
    items,
    total,
    isFetching,
    pagination: { page, pageSize, setPaginationModel },
  } = useDashboardApplicationsWithPagination();
  const columns: GridColDef<
    RouterOutput['protectedDashboardApplication']['list']['items'][number]
  >[] = [
    {
      field: 'id',
      ...idColumn,
    },
    {
      field: 'createdAt',
      ...createdAtColumn,
    },
    {
      field: 'updatedAt',
      ...updatedAtColumn,
    },
    {
      field: 'name',
      flex: 4,
    },
    {
      field: 'category',
      flex: 2,
      valueFormatter: ({ value }) => tApplication(`Category.${value}`, value),
    },
    {
      field: 'price',
      flex: 1,
      type: 'number',
    },
    {
      field: 'status',
      flex: 2,
      valueFormatter: ({ value }) => tApplication(`Status.${value}`, value),
    },
    {
      field: 'providerId',
      flex: 3,
    },
  ];
  return (
    <Card>
      <CardHeader title={tApplication('_')} />
      <CardContent sx={{ height: 352 }}>
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
          {...overrides?.DataGridProps}
        />
      </CardContent>
    </Card>
  );
};
