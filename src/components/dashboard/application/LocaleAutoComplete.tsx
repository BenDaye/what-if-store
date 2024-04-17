import { MultipleAutoCompleteProps } from '@/types/overrides';
import {
  ILocaleData,
  getLocaleData,
  getLocaleDataList,
} from '@/utils/getLocaleList';
import { Autocomplete, ListItem, ListItemText, TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

type LocalesAutoCompleteProps = MultipleAutoCompleteProps<ILocaleData>;

export const LocalesAutoComplete = ({
  overrides,
  defaultValue = [],
  onChange = () => null,
  error,
  disabled = false,
}: LocalesAutoCompleteProps) => {
  const { t } = useTranslation();

  const [locales, setLocales] = useState<ILocaleData[]>(
    () =>
      defaultValue
        .map((code) => getLocaleData(code))
        .filter((v) => v !== false) as ILocaleData[],
  );

  useEffect(() => {
    setLocales(
      defaultValue
        .map((code) => getLocaleData(code))
        .filter((v) => v !== false) as ILocaleData[],
    );
  }, [defaultValue]);

  useEffect(() => {
    onChange(locales.map(({ locale }) => locale));
  }, [locales, onChange]);

  return (
    <Autocomplete
      value={locales}
      onChange={(_, value) => setLocales(value)}
      multiple
      filterSelectedOptions
      limitTags={12}
      clearOnEscape
      disableCloseOnSelect
      options={getLocaleDataList()}
      getOptionKey={(option) => option.locale}
      getOptionLabel={(option) => option.locale}
      isOptionEqualToValue={(option, value) => option.locale === value.locale}
      groupBy={(option) => option.languageCode}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          label={t('application:General.Locales')}
          helperText={error?.message ?? ' '}
          disabled={disabled}
          {...overrides?.TextFieldProps}
        />
      )}
      renderOption={(props, option) => (
        <ListItem dense {...props}>
          <ListItemText primary={option.locale} secondary={option.name} />
        </ListItem>
      )}
      {...overrides?.AutoCompleteProps}
    />
  );
};
