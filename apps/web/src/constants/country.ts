export const FallbackCountry = 'CN';
export const FallbackCurrency = 'CNY';
export const FallbackPriceText = '[???]';
export const UnsupportedCurrencySymbol = '[???]';

export const CurrencySymbol = {
  CNY: '¥',
  USD: '$',
  JPY: '¥',
  EUR: '€',
  GBP: '£',
  KRW: '₩',
  AUD: '$',
  CAD: '$',
  HKD: '$',
  TWD: 'NT$',
  INR: '₹',
  RUB: '₽',
  BRL: 'R$',
  IDR: 'Rp',
  MYR: 'RM',
  PHP: '₱',
  SGD: '$',
  THB: '฿',
  VND: '₫',
  CHF: 'CHF',
  SEK: 'kr',
  DKK: 'kr',
  NOK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  ISK: 'kr',
  HRK: 'kn',
  RON: 'lei',
  TRY: '₺',
  NZD: '$',
  MXN: '$',
  ARS: '$',
  CLP: '$',
  COP: '$',
  PEN: 'S/',
  ZAR: 'R',
  AED: 'د.إ',
  SAR: 'ر.س',
  QAR: 'ر.ق',
} as const;
export type CurrencySymbol =
  (typeof CurrencySymbol)[keyof typeof CurrencySymbol];

export const getCurrencySymbol = (currency: string): CurrencySymbol => {
  return (
    CurrencySymbol[currency as keyof typeof CurrencySymbol] ??
    UnsupportedCurrencySymbol
  );
};
