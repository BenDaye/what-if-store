import { GridColTypeDef } from '@mui/x-data-grid';

export const createdAtColumn: GridColTypeDef = {
  headerName: '创建时间',
  width: 200,
  headerAlign: 'left',
  align: 'left',
  type: 'dateTime',
  hideable: true,
  editable: false,
};

export const updatedAtColumn: GridColTypeDef = {
  headerName: '更新时间',
  width: 200,
  headerAlign: 'left',
  align: 'left',
  type: 'dateTime',
  hideable: true,
  editable: false,
};

export const idColumn: GridColTypeDef = {
  headerName: 'ID',
  width: 200,
  headerAlign: 'left',
  align: 'left',
  hideable: true,
  editable: false,
  type: 'string',
};
