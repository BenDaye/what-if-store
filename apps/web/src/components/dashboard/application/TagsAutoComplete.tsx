import { useDashboardApplicationTags } from '@/hooks';
import type { MultipleAutoCompleteProps } from '@/types/overrides';
import { Autocomplete, ListItem, ListItemText, TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import type { RouterOutput } from '@what-if-store/server/react/trpc';
import type { ApplicationUpdateInputSchema } from '@what-if-store/server/server/schemas';

type ITagData = RouterOutput['protectedDashboardApplicationTag']['list']['items'][number];

type TagsAutoCompleteProps = MultipleAutoCompleteProps<
  ITagData,
  ApplicationUpdateInputSchema['tags'],
  Merge<
    FieldError,
    (
      | Merge<
          FieldError,
          FieldErrorsImpl<{
            id: string;
          }>
        >
      | undefined
    )[]
  >
>;

export const TagsAutoComplete = ({
  overrides,
  defaultValue = [],
  onChange = () => null,
  error,
  disabled = false,
}: TagsAutoCompleteProps) => {
  const { t } = useTranslation();

  const { data } = useDashboardApplicationTags();

  const getTagData = useCallback(
    ({ id }: (typeof defaultValue)[number]): (typeof data)[number] | false => {
      return data.find((data) => data.id === id) || false;
    },
    [data],
  );

  const [tags, setTags] = useState<ITagData[]>(
    () => defaultValue.map((code) => getTagData(code)).filter((v) => v !== false) as ITagData[],
  );

  useEffect(() => {
    setTags(defaultValue.map((code) => getTagData(code)).filter((v) => v !== false) as ITagData[]);
  }, [defaultValue, getTagData]);

  useEffect(() => {
    onChange(tags.map(({ id }) => ({ id })));
  }, [tags, onChange]);

  return (
    <Autocomplete
      value={tags}
      onChange={(_, value) => setTags(value)}
      multiple
      filterSelectedOptions
      limitTags={12}
      clearOnEscape
      disableCloseOnSelect
      options={data}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          label={t('application:General.Tags')}
          helperText={error?.message ?? ' '}
          disabled={disabled}
          {...overrides?.TextFieldProps}
        />
      )}
      renderOption={(props, option) => (
        <ListItem dense {...props}>
          <ListItemText primary={option.name} secondary={option.id} />
        </ListItem>
      )}
      {...overrides?.AutoCompleteProps}
    />
  );
};
