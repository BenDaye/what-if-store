import type { Theme } from '@mui/material';
import type { AppColorThemeType } from '../constants';
import { theme as custom } from './custom';
import { theme as dark } from './dark';
import { theme as light } from './light';

export const themes: Record<AppColorThemeType, Theme> = {
  LIGHT: light,
  GITHUB_LIGHT: light,
  SOLARIZED_LIGHT: light,
  DARK: dark,
  GITHUB_DARK: dark,
  SOLARIZED_DARK: dark,
  CUSTOM: custom,
};

export default themes;
