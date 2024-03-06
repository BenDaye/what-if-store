import { themes } from '@/theme';
import { NOOP } from '@/utils/noop';
import { ThemeProvider, useMediaQuery } from '@mui/material';
import Head from 'next/head';
import {
  PropsWithChildren,
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {
  useDarkMode as useDarkModeHook,
  useLocalStorage,
  useTernaryDarkMode,
} from 'usehooks-ts';

interface DarkModeContextProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  enableDarkMode: () => void;
  disableDarkMode: () => void;
  isAutoDarkMode: boolean;
  toggleAutoDarkMode: () => void;
  enableAutoDarkMode: () => void;
  disableAutoDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps>({
  isDarkMode: true,
  toggleDarkMode: NOOP,
  enableDarkMode: NOOP,
  disableDarkMode: NOOP,
  isAutoDarkMode: true,
  toggleAutoDarkMode: NOOP,
  enableAutoDarkMode: NOOP,
  disableAutoDarkMode: NOOP,
});

export const useDarkMode = (): DarkModeContextProps => {
  return useContext(DarkModeContext);
};

export const DarkModeProvider = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const {
    isDarkMode,
    toggle: toggleDarkMode,
    enable: enableDarkMode,
    disable: disableDarkMode,
  } = useDarkModeHook({
    defaultValue: prefersDarkMode,
    localStorageKey: 'isDarkMode',
    initializeWithValue: false,
  });
  const [isAutoDarkMode, setAutoDarkMode] = useLocalStorage<boolean>(
    'isAutoDarkMode',
    true,
  );
  const toggleAutoDarkMode = useCallback(
    () => setAutoDarkMode(!isAutoDarkMode),
    [isAutoDarkMode, setAutoDarkMode],
  );
  const enableAutoDarkMode = useCallback(
    () => setAutoDarkMode(true),
    [setAutoDarkMode],
  );
  const disableAutoDarkMode = useCallback(
    () => setAutoDarkMode(false),
    [setAutoDarkMode],
  );

  useEffect(() => {
    if (isAutoDarkMode) {
      if (prefersDarkMode) {
        enableDarkMode();
      } else {
        disableDarkMode();
      }
    }
  }, [isAutoDarkMode, prefersDarkMode, enableDarkMode, disableDarkMode]);

  const theme = useMemo(
    () => (isDarkMode ? themes.DARK : themes.LIGHT),
    [isDarkMode],
  );

  return (
    <DarkModeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        enableDarkMode,
        disableDarkMode,
        isAutoDarkMode,
        toggleAutoDarkMode,
        enableAutoDarkMode,
        disableAutoDarkMode,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </DarkModeContext.Provider>
  );
};

export const TernaryDarkModeProvider = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  const { isDarkMode } = useTernaryDarkMode({
    initializeWithValue: false,
  });

  const theme = useMemo(
    () => (isDarkMode ? themes.DARK : themes.LIGHT),
    [isDarkMode],
  );

  return (
    <>
      <Head key="theme">
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  );
};
