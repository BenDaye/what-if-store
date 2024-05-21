import { FallbackVersion } from '@/constants/version';
import type { UseAppApplicationHookDataSchema } from '@/hooks';
import type { OverridesProps } from '@/types/overrides';
import {
  Warning as DefaultIcon,
  Error as DeprecatedIcon,
  NewReleases as LatestIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import type { ChipProps } from '@mui/material';
import { Chip } from '@mui/material';
import { useMemo } from 'react';

type ApplicationVersionChipProps = OverridesProps<{
  ChipProps?: ChipProps;
}> & {
  versions: UseAppApplicationHookDataSchema['versions'];
};
export const ApplicationVersionChip = ({ overrides, versions }: ApplicationVersionChipProps) => {
  const latestVersion = useMemo(
    () =>
      versions.find((version) => version.latest) ??
      versions.sort((a, b) => b.releaseDate.valueOf() - a.releaseDate.valueOf())[0],
    [versions],
  );
  const latestVersionText = useMemo(
    () =>
      `v${latestVersion?.version ?? FallbackVersion}${latestVersion?.preview ? '-preview' : ''}${latestVersion?.deprecated ? '-deprecated' : ''}`,
    [latestVersion],
  );
  return (
    <>
      <Chip
        variant="outlined"
        size="small"
        color={
          latestVersion?.deprecated
            ? 'error'
            : latestVersion?.preview
              ? 'warning'
              : latestVersion?.latest
                ? 'success'
                : 'default'
        }
        label={latestVersionText}
        icon={
          latestVersion?.deprecated ? (
            <DeprecatedIcon />
          ) : latestVersion?.preview ? (
            <PreviewIcon />
          ) : latestVersion?.latest ? (
            <LatestIcon />
          ) : (
            <DefaultIcon />
          )
        }
        sx={{
          fontFamily: 'Roboto Mono',
          borderRadius: 1,
          fontWeight: (theme) => theme.typography.fontWeightBold,
        }}
        {...overrides?.ChipProps}
      />
    </>
  );
};
