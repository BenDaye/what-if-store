import { MultipleAutoCompleteProps } from '@/types/overrides';
import { Autocomplete, ListItem, ListItemText, TextField } from '@mui/material';
import {
  ICountryData,
  TCountryCode,
  getCountryData,
  getCountryDataList,
} from 'countries-list';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

type CountriesAutoCompleteProps = MultipleAutoCompleteProps<ICountryData>;

export const CountriesAutoComplete = ({
  overrides,
  defaultValue = [],
  onChange = () => null,
  error,
  disabled = false,
}: CountriesAutoCompleteProps) => {
  const { t: tApplication } = useTranslation('application', {
    keyPrefix: 'General',
  });

  const _getCountryData = (code: string): ICountryData | false => {
    try {
      return getCountryData(code as TCountryCode);
    } catch {
      return false;
    }
  };

  const [countries, setCountries] = useState<ICountryData[]>(
    () =>
      defaultValue
        .map((code) => _getCountryData(code))
        .filter((v) => v !== false) as ICountryData[],
  );

  useEffect(() => {
    setCountries(
      defaultValue
        .map((code) => _getCountryData(code))
        .filter((v) => v !== false) as ICountryData[],
    );
  }, [defaultValue]);

  useEffect(() => {
    onChange(countries.map((country) => country.iso2));
  }, [countries, onChange]);

  return (
    <Autocomplete
      value={countries}
      onChange={(_, value) => setCountries(value)}
      multiple
      filterSelectedOptions
      limitTags={12}
      clearOnEscape
      disableCloseOnSelect
      options={getCountryDataList().sort((a, b) =>
        a.continent.localeCompare(b.continent),
      )}
      getOptionKey={(option) => option.name}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      groupBy={(option) => option.continent}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          label={tApplication('Countries', 'Countries')}
          helperText={error?.message ?? ' '}
          disabled={disabled}
          {...overrides?.TextFieldProps}
        />
      )}
      renderOption={(props, option) => (
        <ListItem dense {...props}>
          <ListItemText primary={option.name} secondary={option.native} />
        </ListItem>
      )}
      {...overrides?.AutoCompleteProps}
    />
  );
};
