import { useDashboardApplicationsWithPagination } from '@/hooks';
import { RouterOutput } from '@/utils/trpc';
import { TableContainerProps } from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  // GridRowModel,
  GridToolbar,
  zhCN,
} from '@mui/x-data-grid';

type ApplicationDataGridProps = {
  overrides?: {
    DataGridProps?: DataGridProps;
    TableContainerProps: TableContainerProps;
  };
};

export const ApplicationDataGrid = ({
  overrides,
}: ApplicationDataGridProps) => {
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
      headerName: 'ID',
      width: 200,
      hideable: true,
      editable: false,
    },
  ];
  return (
    <DataGrid
      autoHeight
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
  );
};
