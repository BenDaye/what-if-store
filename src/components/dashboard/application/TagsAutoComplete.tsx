import { useDashboardApplicationTags } from '@/hooks';
import { ApplicationUpdateInputSchema } from '@/server/schemas';
import { MultipleAutoCompleteProps } from '@/types/overrides';
import { RouterOutput } from '@/utils/trpc';
import { Autocomplete, ListItem, ListItemText, TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

type ITagData =
  RouterOutput['protectedDashboardApplicationTag']['list']['items'][number];

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
  const { t: tApplicationGeneral } = useTranslation('application', {
    keyPrefix: 'General',
  });

  const { flattedData } = useDashboardApplicationTags();

  const getTagData = useCallback(
    ({
      id,
    }: (typeof defaultValue)[number]): (typeof flattedData)[number] | false => {
      return flattedData.find((data) => data.id === id) || false;
    },
    [flattedData],
  );

  const [tags, setTags] = useState<ITagData[]>(
    () =>
      defaultValue
        .map((code) => getTagData(code))
        .filter((v) => v !== false) as ITagData[],
  );

  useEffect(() => {
    setTags(
      defaultValue
        .map((code) => getTagData(code))
        .filter((v) => v !== false) as ITagData[],
    );
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
      options={flattedData}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          label={tApplicationGeneral('Tags', 'Tags')}
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
