import type { PropsWithChildren, ReactElement } from 'react';

export const DashboardProvider = ({ children }: PropsWithChildren): ReactElement<PropsWithChildren> => {
  return <>{children}</>;
};
