import { PropsWithChildren, ReactElement } from 'react';

export const AppProvider = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  return <>{children}</>;
};
