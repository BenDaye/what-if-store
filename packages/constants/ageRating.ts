export const AgeRating = {
  Any: 0,
  '3+': 3,
  '7+': 7,
  '12+': 12,
  '16+': 16,
  '18+': 18,
  Never: 999,
} as const;
export type AgeRating = (typeof AgeRating)[keyof typeof AgeRating];

export const getAgeRatingLabel = (ageRating: AgeRating) => {
  switch (ageRating) {
    case AgeRating.Any:
      return 'Any';
    case AgeRating['3+']:
      return '3+';
    case AgeRating['7+']:
      return '7+';
    case AgeRating['12+']:
      return '12+';
    case AgeRating['16+']:
      return '16+';
    case AgeRating['18+']:
      return '18+';
    case AgeRating.Never:
      return 'Never';
    default:
      return 'Unknown';
  }
};
