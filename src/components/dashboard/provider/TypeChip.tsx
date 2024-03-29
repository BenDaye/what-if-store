import { Chip, ChipProps } from '@mui/material';
import { ProviderType } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren, useMemo } from 'react';

type ProviderTypeChipProps = {
  overrides?: {
    ChipProps?: ChipProps;
  };
  type: ProviderType;
};

export const ProviderTypeChip = ({
  overrides,
  type,
}: PropsWithChildren<ProviderTypeChipProps>) => {
  const { t: tProvider } = useTranslation('provider');
  const color = useMemo<ChipProps['color']>(() => {
    switch (type) {
      case ProviderType.IndependentDeveloper:
        return 'success';
      case ProviderType.Company:
        return 'warning';
      case ProviderType.Community:
        return 'error';
      default:
        return 'default';
    }
  }, [type]);
  return (
    <Chip
      label={tProvider(`Type.${type}._`, type)}
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
