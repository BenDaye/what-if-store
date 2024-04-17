export const AgeRating = {
  '3+': '3+',
  '7+': '7+',
  '12+': '12+',
  '16+': '16+',
  '18+': '18+',
} as const;
export type AgeRating = (typeof AgeRating)[keyof typeof AgeRating];
