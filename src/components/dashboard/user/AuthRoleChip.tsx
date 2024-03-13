import { Chip, ChipProps } from '@mui/material';
import { AuthRole } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren, useMemo } from 'react';

type AuthRoleChipProps = {
  overrides?: {
    ChipProps?: ChipProps;
  };
  role: AuthRole;
};

export const AuthRoleChip = ({
  overrides,
  role,
}: PropsWithChildren<AuthRoleChipProps>) => {
  const { t: tUser } = useTranslation('user');
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
  return (
    <Chip
      label={tUser(`Role.${role}._`, role)}
      sx={{
        borderRadius: 1,
      }}
      size="small"
      variant="filled"
      color={color}
      {...overrides?.ChipProps}
    />
  );
};
