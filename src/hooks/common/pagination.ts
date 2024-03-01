import { SortDirection } from '@mui/material';
import { GridCallbackDetails, GridPaginationModel } from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from 'react';

type GridPagination = {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
};
export function useGridPagination(params?: GridPagination) {
  const [pagination, setPagination] = useState<GridPagination>(
    params ?? {
      page: 0,
      pageSize: 100,
      sortBy: 'id',
      sortDirection: 'asc',
    },
  );

  const setPaginationModel = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (model: GridPaginationModel, _details: GridCallbackDetails<any>) => {
      setPagination({
        ...pagination,
        page: model.page,
        pageSize: model.pageSize,
      });
    },
    [pagination],
  );

  const setSortBy = useCallback(
    (sortBy: string) => {
      setPagination({ ...pagination, sortBy });
    },
    [pagination],
  );

  const setSortDirection = useCallback(
    (sortDirection: 'asc' | 'desc') => {
      setPagination({ ...pagination, sortDirection });
    },
    [pagination],
  );

  const reset = useCallback(() => {
    setPagination({
      page: 0,
      pageSize: 10,
      sortBy: 'id',
      sortDirection: 'asc',
    });
  }, []);

  const skip = useMemo(
    () => pagination.page * pagination.pageSize,
    [pagination],
  );

  return {
    pagination,
    setPaginationModel,
    setSortBy,
    setSortDirection,
    reset,
    skip,
  };
}
