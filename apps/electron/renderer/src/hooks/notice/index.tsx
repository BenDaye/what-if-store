/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
import { Close as CloseIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import type { OptionsObject, SnackbarKey } from 'notistack';
import { useSnackbar } from 'notistack';
import type { Context, PropsWithChildren, ReactElement } from 'react';
import { createContext, useCallback, useContext } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export interface NoticeContextProps {
  show: (message: string, options?: OptionsObject) => SnackbarKey;
  showError: (message: string, options?: OptionsObject) => SnackbarKey;
  showSuccess: (message: string, options?: OptionsObject) => SnackbarKey;
  showWarning: (message: string, options?: OptionsObject) => SnackbarKey;
  showInfo: (message: string, options?: OptionsObject) => SnackbarKey;
  close: (key?: SnackbarKey) => void;
}

export const NoticeContext: Context<NoticeContextProps> = createContext<NoticeContextProps>({
  show: (_message: string, _options?: OptionsObject) => 0,
  showError: (_message: string, _options?: OptionsObject) => 0,
  showSuccess: (_message: string, _options?: OptionsObject) => 0,
  showWarning: (_message: string, _options?: OptionsObject) => 0,
  showInfo: (_message: string, _options?: OptionsObject) => 0,
  close: (_key?: SnackbarKey) => {
    console.log(_key);
  },
});

export const useNotice = () => useContext(NoticeContext);

export const NoticeProvider = ({ children }: PropsWithChildren): ReactElement<PropsWithChildren> => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const show = useCallback(
    (message: string, options?: OptionsObject): SnackbarKey => enqueueSnackbar(message, options),
    [],
  );
  const showError = useCallback(
    (message: string, options?: OptionsObject): SnackbarKey =>
      enqueueSnackbar(message, {
        variant: 'error',
        persist: true,
        action: (key) => (
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <CloseIcon />
          </IconButton>
        ),
        ...options,
      }),
    [],
  );
  const showSuccess = useCallback(
    (message: string, options?: OptionsObject): SnackbarKey =>
      enqueueSnackbar(message, { variant: 'success', ...options }),
    [],
  );
  const showWarning = useCallback(
    (message: string, options?: OptionsObject): SnackbarKey =>
      enqueueSnackbar(message, {
        variant: 'warning',
        persist: true,
        action: (key) => (
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <CloseIcon />
          </IconButton>
        ),
        ...options,
      }),
    [],
  );
  const showInfo = useCallback(
    (message: string, options?: OptionsObject): SnackbarKey =>
      enqueueSnackbar(message, { variant: 'info', ...options }),
    [],
  );

  const close = useCallback((key?: SnackbarKey): void => closeSnackbar(key), []);

  return (
    <NoticeContext.Provider
      value={{
        show,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        close,
      }}
    >
      <ErrorBoundary showError={showError}>{children}</ErrorBoundary>
    </NoticeContext.Provider>
  );
};
