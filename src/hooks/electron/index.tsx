import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useIsClient } from 'usehooks-ts';

export interface ElectronProviderProps {
  isElectron: boolean;
}

const ElectronContext = createContext<ElectronProviderProps>({
  isElectron: false,
});

export const useElectron = () => useContext(ElectronContext);

export const ElectronProvider = ({ children }: PropsWithChildren) => {
  const isClient = useIsClient();
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const isRunningInElectron = typeof window?.electronAPI !== 'undefined';
    setIsElectron(isRunningInElectron);
  }, [isClient]);
  return (
    <ElectronContext.Provider value={{ isElectron }}>
      {children}
    </ElectronContext.Provider>
  );
};
