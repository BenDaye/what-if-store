import { EmptyDataBox } from '@/components/common';
import { useNotice } from '@/hooks';
import type { OverridesDataGridProps } from '@/types/overrides';
import { Paper } from '@mui/material';
import { DataGrid, zhCN, type GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { trpc, type RouterOutput } from '@what-if-store/bridge/react/trpc';

type InstalledApp = RouterOutput['application']['getInstalledApps'][number];

export const InstalledApps = () => {
  const { showWarning } = useNotice();
  const { data, error, isFetching } = trpc.application.getInstalledApps.useQuery(undefined, {
    initialData: [],
    enabled: typeof window !== 'undefined',
  });

  useEffect(() => {
    if (error) showWarning(error.message);
  }, [error, showWarning]);

  const [detectedOS, setDetectedOS] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes('Win')) {
      setDetectedOS('Windows');
    } else if (userAgent.includes('Mac')) {
      setDetectedOS('MacOS');
    } else {
      setDetectedOS('UNSUPPORTED');
    }
  }, []);

  if (detectedOS === 'UNSUPPORTED' || detectedOS === null) {
    return <EmptyDataBox message="Unsupported OS" />;
  }

  return (
    <Paper>
      <InstalledAppList data={data} isFetching={isFetching} />
    </Paper>
  );
};

type InstalledAppListProps = OverridesDataGridProps & {
  data: InstalledApp[];
  isFetching?: boolean;
};
export const InstalledAppList = ({ overrides, data, isFetching }: InstalledAppListProps) => {
  const { t } = useTranslation();
  if (!data.length) {
    return <EmptyDataBox message={t('common:NoInstalledApplications')} />;
  }

  const columns: GridColDef<InstalledApp>[] = [
    {
      field: 'appName',
      headerName: t('application:DataGridHeaderName.Name'),
      flex: 4,
      minWidth: 320,
    },
    {
      field: 'appIdentifier',
      headerName: t('application:DataGridHeaderName.Identifier'),
      flex: 4,
    },
    {
      field: 'appInstallDate',
      headerName: t('application:DataGridHeaderName.InstallDate'),
      flex: 1,
    },
    {
      field: 'appVersion',
      headerName: t('application:DataGridHeaderName.Version'),
      flex: 1,
    },
  ];

  return (
    <DataGrid
      disableRowSelectionOnClick
      initialState={{
        pagination: {
          paginationModel: {
            page: 0,
            pageSize: 100,
          },
        },
      }}
      columns={columns}
      rows={data}
      rowCount={data.length}
      loading={isFetching}
      localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
      pageSizeOptions={[20, 50, 100]}
      paginationMode="client"
      sortingMode="client"
      getRowId={(row) => row.appIdentifier}
      {...overrides?.DataGridProps}
    />
  );
};
