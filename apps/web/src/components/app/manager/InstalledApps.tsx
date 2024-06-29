import { Typography } from '@mui/material';
import { trpc } from '@what-if-store/bridge/react/trpc';

export const InstalledApps = () => {
  const installedApps = trpc.application.getInstalledApps.useQuery();

  return (
    <code>
      <pre>{JSON.stringify(installedApps?.data ?? [], null, 2)}</pre>
    </code>
  );
};
