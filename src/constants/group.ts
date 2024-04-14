export const PermanentPresetGroupNames = {
  Recommended: 'Recommended',
  New: 'New',
  Updated: 'Updated',
  Promotional: 'Promotional',
} as const;
export type PermanentPresetGroupNames =
  (typeof PermanentPresetGroupNames)[keyof typeof PermanentPresetGroupNames];

export const PersistentPresetGroupNames = {
  MostFollowersOfAllTime: 'MostFollowersOfAllTime',
  MostFollowersOfThisMonth: 'MostFollowersOfThisMonth',
  MostFollowersOfThisWeek: 'MostFollowersOfThisWeek',
  MostFollowersOfToday: 'MostFollowersOfToday',
  MostOwnersOfAllTime: 'MostOwnersOfAllTime',
  MostOwnersOfThisMonth: 'MostOwnersOfThisMonth',
  MostOwnersOfThisWeek: 'MostOwnersOfThisWeek',
  MostOwnersOfToday: 'MostOwnersOfToday',
} as const;
export type PersistentPresetGroupNames =
  (typeof PersistentPresetGroupNames)[keyof typeof PersistentPresetGroupNames];
