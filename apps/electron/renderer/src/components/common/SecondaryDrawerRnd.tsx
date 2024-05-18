import {
  APP_PRIMARY_DRAWER_WIDTH,
  APP_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
  APP_SECONDARY_DRAWER_WIDTH,
  APP_SECONDARY_DRAWER_WIDTH_EDITABLE,
  APP_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
  DASHBOARD_PRIMARY_DRAWER_WIDTH,
  DASHBOARD_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
  DASHBOARD_SECONDARY_DRAWER_WIDTH,
  DASHBOARD_SECONDARY_DRAWER_WIDTH_EDITABLE,
  DASHBOARD_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
  DEFAULT_PRIMARY_DRAWER_WIDTH,
  DEFAULT_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
  DEFAULT_SECONDARY_DRAWER_WIDTH,
  DEFAULT_SECONDARY_DRAWER_WIDTH_EDITABLE,
  DEFAULT_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
} from '@/constants/drawer';
import { useTheme } from '@mui/material';
import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useDebounceCallback, useLocalStorage } from 'usehooks-ts';

type SecondaryDrawerRndProps = { key?: 'DEFAULT' | 'APP' | 'DASHBOARD' };
export const SecondaryDrawerRnd = ({
  key = 'DEFAULT',
}: SecondaryDrawerRndProps) => {
  const localStorageKey =
    key === 'DASHBOARD'
      ? DASHBOARD_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY
      : key === 'APP'
        ? APP_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY
        : DEFAULT_SECONDARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY;
  const width =
    key === 'DASHBOARD'
      ? DASHBOARD_SECONDARY_DRAWER_WIDTH
      : key === 'APP'
        ? APP_SECONDARY_DRAWER_WIDTH
        : DEFAULT_SECONDARY_DRAWER_WIDTH;
  const editable =
    key === 'DASHBOARD'
      ? DASHBOARD_SECONDARY_DRAWER_WIDTH_EDITABLE
      : key === 'APP'
        ? APP_SECONDARY_DRAWER_WIDTH_EDITABLE
        : DEFAULT_SECONDARY_DRAWER_WIDTH_EDITABLE;

  const theme = useTheme();
  const [secondaryRndZIndex, setSecondaryRndZIndex] = useState<number>(10);
  const [primaryDrawerWidth] = useLocalStorage<number>(
    key === 'DASHBOARD'
      ? DASHBOARD_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY
      : key === 'APP'
        ? APP_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY
        : DEFAULT_PRIMARY_DRAWER_WIDTH_LOCAL_STORAGE_KEY,
    key === 'DASHBOARD'
      ? DASHBOARD_PRIMARY_DRAWER_WIDTH
      : key === 'APP'
        ? APP_PRIMARY_DRAWER_WIDTH
        : DEFAULT_PRIMARY_DRAWER_WIDTH,
    {
      initializeWithValue: false,
    },
  );
  const [secondaryDrawerWidth, setSecondaryDrawerWidth] =
    useLocalStorage<number>(localStorageKey, width, {
      initializeWithValue: false,
    });
  const handleSecondaryDrawerWidth = useDebounceCallback(
    setSecondaryDrawerWidth,
    10,
  );

  return (
    <Rnd
      style={{
        zIndex: editable ? secondaryRndZIndex : 0,
        backgroundImage:
          theme.palette.mode === 'dark'
            ? `linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.05))`
            : `linear-gradient(rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.05))`,
      }}
      size={{
        height: editable ? '100vh' : 0,
        width: editable ? secondaryDrawerWidth : 0,
      }}
      resizeHandleClasses={{
        right:
          theme.palette.mode === 'dark'
            ? 'resizeHandleClass darkMode'
            : 'resizeHandleClass',
      }}
      position={{ x: primaryDrawerWidth, y: 0 }}
      maxWidth={480}
      minWidth={240}
      disableDragging
      enableResizing={{
        top: false,
        right: editable,
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
