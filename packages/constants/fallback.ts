export const FallbackString = {
  AgeRating: 'never',
  String: '-',
  Id: '00000000-0000-0000-0000-000000000000',
  Version: '0.0.0',
} as const;

export type FallbackString = (typeof FallbackString)[keyof typeof FallbackString];
