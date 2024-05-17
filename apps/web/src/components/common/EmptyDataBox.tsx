import { OverridesProps } from '@/types/overrides';
import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';

type EmptyDataBoxProps = OverridesProps<{ BoxProps?: BoxProps }> & {
  message?: string;
  height?: number;
};
export const EmptyDataBox = ({
  overrides,
  message,
  height = 120,
}: EmptyDataBoxProps) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      {...overrides?.BoxProps}
    >
      <Typography variant="caption" color="text.disabled">
        {message ?? t('common:NoData')}
      </Typography>
    </Box>
  );
};
