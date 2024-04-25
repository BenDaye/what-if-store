import { FallbackPriceText, getCurrencySymbol } from '@/constants/country';
import { Stack, Typography, TypographyProps } from '@mui/material';
import currency from 'currency.js';
import { useMemo } from 'react';

type PriceTextProps = {
  integerVarient?: TypographyProps['variant'];
  decimalVarient?: TypographyProps['variant'];
  color?: TypographyProps['color'];
  price?: {
    price: number;
    currency: string;
    country: string;
  };
};
export const PriceText = ({
  integerVarient = 'body2',
  decimalVarient,
  color = 'error.dark',
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
    <Stack direction={'row'} alignItems={'baseline'}>
      <Typography
        color={color}
        variant={_decimalVarient}
        sx={{ fontFamily: 'Roboto Mono', mr: 0.5 }}
      >
        {symbol}
      </Typography>
      <Typography
        color={color}
        variant={integerVarient}
        sx={{
          fontFamily: 'Roboto Mono',
          fontWeight: (theme) => theme.typography.fontWeightMedium,
        }}
      >
        {integerPart}
      </Typography>
      <Typography
        color={color}
        variant={_decimalVarient}
        sx={{
          fontFamily: 'Roboto Mono',
        }}
      >
        .{decimalPart}
      </Typography>
    </Stack>
  ) : (
    <Typography
      color={color}
      variant={_decimalVarient}
      sx={{ fontFamily: 'Roboto Mono' }}
    >
      {FallbackPriceText}
    </Typography>
  );
};
