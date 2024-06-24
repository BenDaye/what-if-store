import type { OverridesProps } from '@/types/overrides';
import type { ChipProps } from '@mui/material';
import { Chip } from '@mui/material';
import { useTranslation } from 'next-i18next';
import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { AuthRole } from '@what-if-store/prisma/client';

type AuthRoleChipProps = OverridesProps<{
  ChipProps?: ChipProps;
}> & {
  role: AuthRole;
};

export const AuthRoleChip = ({ overrides, role }: PropsWithChildren<AuthRoleChipProps>) => {
  const { t } = useTranslation();
  const color = useMemo<ChipProps['color']>(() => {
    switch (role) {
      case AuthRole.User:
        return 'success';
      case AuthRole.Provider:
        return 'warning';
      case AuthRole.Admin:
        return 'error';
      default:
        return 'default';
    }
  }, [role]);
  return <Chip label={t(`auth:Role.${role}`)} size="small" color={color} {...overrides?.ChipProps} />;
};
