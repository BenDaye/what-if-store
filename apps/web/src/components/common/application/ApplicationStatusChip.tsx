import type { OverridesProps } from '@/types/overrides';
import type { ChipProps } from '@mui/material';
import { Chip } from '@mui/material';
import { ApplicationStatus } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

type ApplicationStatusChipProps = OverridesProps<{
  ChipProps?: ChipProps;
}> & {
  status: ApplicationStatus;
};
export const ApplicationStatusChip = ({ overrides, status }: ApplicationStatusChipProps) => {
  const { t } = useTranslation();
  const color = useMemo<ChipProps['color']>(() => {
    switch (status) {
      case ApplicationStatus.Draft:
        return 'default';
      case ApplicationStatus.Pending:
        return 'default';
      case ApplicationStatus.Approved:
        return 'warning';
      case ApplicationStatus.Rejected:
        return 'warning';
      case ApplicationStatus.Deleted:
        return 'error';
      case ApplicationStatus.Banned:
        return 'error';
      case ApplicationStatus.Hidden:
        return 'error';
      case ApplicationStatus.Published:
        return 'success';
      case ApplicationStatus.Suspended:
        return 'success';
      case ApplicationStatus.Achieved:
        return 'success';
      default:
        return 'default';
    }
  }, [status]);
  return (
    <Chip
      label={t(`application:Status.Text.${status}`)}
      size="small"
      color={color}
      variant="outlined"
      {...overrides?.ChipProps}
    />
  );
};
