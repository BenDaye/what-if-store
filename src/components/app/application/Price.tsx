import { FallbackPriceText, getCurrencySymbol } from '@/constants/country';
import { OverridesProps } from '@/types/overrides';
import { Stack, StackProps, Typography, TypographyProps } from '@mui/material';
import currency from 'currency.js';
import { useMemo } from 'react';

type PriceTextProps = OverridesProps<{
  WrapperProps?: StackProps;
  SymbolProps?: TypographyProps;
  IntegerProps?: TypographyProps;
  DecimalProps?: TypographyProps;
}> & {
  integerVarient?: TypographyProps['variant'];
  decimalVarient?: TypographyProps['variant'];
  price?: {
    price: number;
    currency: string;
    country: string;
  };
};
export const PriceText = ({
  overrides,
  integerVarient = 'body2',
  decimalVarient,
  price,
}: PriceTextProps) => {
  const _decimalVarient = useMemo(() => {
    if (decimalVarient) return decimalVarient;

    switch (integerVarient) {
      case 'h1':
        return 'h2';
      case 'h2':
        return 'h3';
      case 'h3':
        return 'h4';
      case 'h4':
        return 'h5';
      case 'h5':
        return 'h6';
      case 'h6':
        return 'subtitle1';
      case 'subtitle1':
        return 'subtitle2';
      case 'subtitle2':
        return 'caption';
      case 'body1':
        return 'body2';
      case 'body2':
        return 'caption';
      default:
        return 'caption';
    }
  }, [integerVarient, decimalVarient]);
  const symbol = useMemo(
    () => (price?.currency ? getCurrencySymbol(price.currency) : ''),
    [price],
  );
  const integerPart = useMemo(() => {
    if (!price) return '';
    return currency(price.price, { fromCents: true, symbol: '' })
      .format()
      .split('.')[0];
  }, [price]);
  const decimalPart = useMemo(() => {
    if (!price) return '';
    return currency(price.price, { fromCents: true, symbol: '' })
      .format()
      .split('.')[1];
  }, [price]);

  return price ? (
    <Stack
      direction={'row'}
      alignItems={'baseline'}
      sx={{
        px: 1,
        color: (theme) =>
          theme.palette.mode === 'dark' ? 'error.light' : 'error.dark',
      }}
      {...overrides?.WrapperProps}
    >
      <Typography
        variant={_decimalVarient}
        sx={{ fontFamily: 'Roboto Mono', mr: 0.5 }}
        {...overrides?.SymbolProps}
      >
        {symbol}
      </Typography>
      <Typography
        variant={integerVarient}
        sx={{
          fontFamily: 'Roboto Mono',
          fontWeight: (theme) => theme.typography.fontWeightMedium,
        }}
        {...overrides?.IntegerProps}
      >
        {integerPart}
      </Typography>
      <Typography
        variant={_decimalVarient}
        sx={{
          fontFamily: 'Roboto Mono',
        }}
        {...overrides?.DecimalProps}
      >
        .{decimalPart}
      </Typography>
    </Stack>
  ) : (
    <Typography
      variant={_decimalVarient}
      sx={{
        fontFamily: 'Roboto Mono',
        color: (theme) =>
          theme.palette.mode === 'dark' ? 'error.light' : 'error.dark',
      }}
      {...overrides?.DecimalProps}
    >
      {FallbackPriceText}
    </Typography>
  );
};
