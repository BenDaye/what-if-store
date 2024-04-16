import {
  APP_PRIMARY_DRAWER_WIDTH,
  APP_PRIMARY_DRAWER_WIDTH_EDITABLE,
  APP_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
} from '@/constants/drawer';
import { useTheme } from '@mui/material';
import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useDebounceCallback, useLocalStorage } from 'usehooks-ts';

export const PrimaryDrawerRnd = () => {
  const theme = useTheme();
  const [primaryRndZIndex, setPrimaryRndZIndex] = useState<number>(
    () => theme.zIndex.drawer + 8,
  );
  const [primaryDrawerWidth, setPrimaryDrawerWidth] = useLocalStorage<number>(
    APP_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
    APP_PRIMARY_DRAWER_WIDTH,
    {
      initializeWithValue: false,
    },
  );
  const handlePrimaryDrawerWidth = useDebounceCallback(
    setPrimaryDrawerWidth,
    10,
  );
  return (
    <Rnd
      style={{
        zIndex: APP_PRIMARY_DRAWER_WIDTH_EDITABLE ? primaryRndZIndex : 0,
        backgroundImage:
          theme.palette.mode === 'dark'
            ? `linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.05))`
            : `linear-gradient(rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.05))`,
      }}
      size={{
        height: APP_PRIMARY_DRAWER_WIDTH_EDITABLE ? '100vh' : 0,
        width: APP_PRIMARY_DRAWER_WIDTH_EDITABLE ? primaryDrawerWidth : 0,
      }}
      resizeHandleClasses={{
        right:
          theme.palette.mode === 'dark'
            ? 'resizeHandleClass darkMode'
            : 'resizeHandleClass',
      }}
      position={{ x: 0, y: 0 }}
      maxWidth={240}
      minWidth={48}
      disableDragging
      enableResizing={{
        top: false,
        right: APP_PRIMARY_DRAWER_WIDTH_EDITABLE,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      onResizeStart={() => setPrimaryRndZIndex(theme.zIndex.drawer + 20)}
      onResize={(e, direction, ref) => {
        handlePrimaryDrawerWidth(ref.offsetWidth);
      }}
      onResizeStop={() => {
        setPrimaryRndZIndex(theme.zIndex.drawer + 8);
      }}
    />
  );
};
