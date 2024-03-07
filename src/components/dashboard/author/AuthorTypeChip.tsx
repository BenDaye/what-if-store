import { Chip, ChipProps } from '@mui/material';
import { AuthorType } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren, useMemo } from 'react';

type AuthorTypeChipProps = {
  overrides?: {
    ChipProps?: ChipProps;
  };
  type: AuthorType;
};

export const AuthorTypeChip = ({
  overrides,
  type,
}: PropsWithChildren<AuthorTypeChipProps>) => {
  const { t: tAuthor } = useTranslation('author');
  const color = useMemo<ChipProps['color']>(() => {
    switch (type) {
      case AuthorType.IndependentDeveloper:
        return 'success';
      case AuthorType.Company:
        return 'warning';
      case AuthorType.Community:
        return 'error';
      default:
        return 'default';
    }
  }, [type]);
  return (
    <Chip
      label={tAuthor(`Type.${type}._`, type)}
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
