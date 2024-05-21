import {
  APP_PRIMARY_DRAWER_WIDTH,
  APP_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
  APP_SECONDARY_DRAWER_WIDTH,
  APP_SECONDARY_DRAWER_WIDTH_EDITABLE,
  APP_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
} from '@/constants/drawer';
import { useTheme } from '@mui/material';
import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useDebounceCallback, useLocalStorage } from 'usehooks-ts';

export const SecondaryDrawerRnd = () => {
  const theme = useTheme();
  const [secondaryRndZIndex, setSecondaryRndZIndex] = useState<number>(10);
  const [primaryDrawerWidth] = useLocalStorage<number>(
    APP_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
    APP_PRIMARY_DRAWER_WIDTH,
    {
      initializeWithValue: false,
    },
  );
  const [secondaryDrawerWidth, setSecondaryDrawerWidth] = useLocalStorage<number>(
    APP_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
    APP_SECONDARY_DRAWER_WIDTH,
    {
      initializeWithValue: false,
    },
  );
  const handleSecondaryDrawerWidth = useDebounceCallback(setSecondaryDrawerWidth, 10);

  return (
    <Rnd
      style={{
        zIndex: APP_SECONDARY_DRAWER_WIDTH_EDITABLE ? secondaryRndZIndex : 0,
        backgroundImage:
          theme.palette.mode === 'dark'
            ? `linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.05))`
            : `linear-gradient(rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.05))`,
      }}
      size={{
        height: APP_SECONDARY_DRAWER_WIDTH_EDITABLE ? '100vh' : 0,
        width: APP_SECONDARY_DRAWER_WIDTH_EDITABLE ? secondaryDrawerWidth : 0,
      }}
      resizeHandleClasses={{
        right: theme.palette.mode === 'dark' ? 'resizeHandleClass darkMode' : 'resizeHandleClass',
      }}
      position={{ x: primaryDrawerWidth, y: 0 }}
      maxWidth={480}
      minWidth={240}
      disableDragging
      enableResizing={{
        top: false,
        right: APP_SECONDARY_DRAWER_WIDTH_EDITABLE,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      onResizeStart={() => setSecondaryRndZIndex(theme.zIndex.drawer + 10)}
      onResize={(e, direction, ref) => {
        handleSecondaryDrawerWidth(ref.offsetWidth);
      }}
      onResizeStop={() => {
        setSecondaryRndZIndex(10);
      }}
    />
  );
};
