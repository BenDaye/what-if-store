import { countries, ICountry } from 'countries-list';

export const getLocaleStringList = (): string[] =>
  Object.entries(countries)
    .map(([countryCode, country]) =>
      country.languages.map((languageCode) => `${languageCode}_${countryCode}`),
    )
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();

export interface ILocaleData extends ICountry {
  countryCode: string;
  languageCode: string;
  locale: string;
}
export type TLocales = Record<string, ILocaleData>;
export const getLocales = (): TLocales => {
  const locales: TLocales = {};

  for (const [countryCode, country] of Object.entries(countries)) {
    for (const languageCode of country.languages) {
      const locale = `${languageCode}_${countryCode}`;
      locales[locale] = {
        ...country,
        locale,
        countryCode,
        languageCode,
      };
    }
  }

  return locales;
};

export const getLocaleData = (locale: string): ILocaleData | false => {
  const locales = getLocales();
  return locales[locale] || false;
};

export const getLocaleDataList = (): ILocaleData[] =>
  Object.values(getLocales()).sort((a, b) => a.locale.localeCompare(b.locale));
