export enum AppColorTheme {
  LIGHT = 'Light',
  DARK = 'Dark',
  GITHUB_LIGHT = 'Github Light',
  GITHUB_DARK = 'Github Dark',
  SOLARIZED_LIGHT = 'Solarized Light',
  SOLARIZED_DARK = 'Solarized Dark',
  CUSTOM = 'Custom',
}

export type AppColorThemeType = keyof typeof AppColorTheme;
