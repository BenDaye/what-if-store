import { useDashboardUploadWithPagination } from '@/hooks';
import type { OverridesCardProps } from '@/types/overrides';
import { createdAtColumn, idColumn, updatedAtColumn } from '@/utils/dataGridColumn';
import type { RouterOutput } from '@/utils/trpc';
import { Card, CardContent, CardHeader } from '@mui/material';
import type { DataGridProps, GridColDef, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { DataGrid, GridToolbar, zhCN } from '@mui/x-data-grid';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import { PreviewLink } from './PreviewLink';
import { UploadButton } from './UploadButton';

type UploadListSectionCardProps = {
  overrides?: OverridesCardProps['overrides'] & {
    DataGridProps?: DataGridProps;
  };
};

type RowModel = RouterOutput['protectedDashboardUpload']['list']['items'][number];

export const UploadListSectionCard = ({ overrides }: UploadListSectionCardProps) => {
  const { t } = useTranslation();
  const {
    router: { refetch, isFetching },
    items,
    total,
    pagination: { page, pageSize, setPaginationModel },
  } = useDashboardUploadWithPagination();
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
      headerName: t('upload:DataGridHeaderName.Name'),
      flex: 4,
      renderCell: ({ row }) => <PreviewLink name={row.name} path={row.path} />,
    },
    {
      field: 'mimeType',
      headerName: t('upload:DataGridHeaderName.MIMEType'),
      flex: 1,
    },
    {
      field: 'size',
      headerName: t('upload:DataGridHeaderName.Size'),
      flex: 1,
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
        title={t('upload:_')}
        titleTypographyProps={{
          variant: 'subtitle1',
        }}
        action={<UploadButton onClose={refetch} />}
        {...overrides?.CardHeaderProps}
      />
      <CardContent sx={{ height: 600 }} {...overrides?.CardContentProps}>
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
