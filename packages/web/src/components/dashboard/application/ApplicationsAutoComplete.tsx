import { ApplicationStatusChip } from '@/components/common';
import { useDashboardApplications, useDashboardUser } from '@/hooks';
import { idSchema } from '@/server/schemas';
import { MultipleAutoCompleteProps, OverridesProps } from '@/types/overrides';
import { RouterOutput } from '@/utils/trpc';
import {
  Autocomplete,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListItemTextProps,
  TextField,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { z } from 'zod';

type IApplicationData =
  RouterOutput['protectedDashboardApplication']['list']['items'][number];
const idArraySchema = z.object({ id: idSchema }).array();
type IdArraySchema = z.infer<typeof idArraySchema>;

type ApplicationsAutoCompleteProps = MultipleAutoCompleteProps<
  IApplicationData,
  IdArraySchema,
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

export const ApplicationsAutoComplete = ({
  overrides,
  defaultValue = [],
  onChange = () => null,
  error,
  disabled = false,
  routerInput,
}: ApplicationsAutoCompleteProps) => {
  const { t } = useTranslation();

  const { data } = useDashboardApplications(routerInput);

  const getTagData = useCallback(
    ({ id }: (typeof defaultValue)[number]): (typeof data)[number] | false => {
      return data.find((data) => data.id === id) || false;
    },
    [data],
  );

  const [value, setValue] = useState<IApplicationData[]>(
    () =>
      defaultValue
        .map((code) => getTagData(code))
        .filter((v) => v !== false) as IApplicationData[],
  );

  useEffect(() => {
    setValue(
      defaultValue
        .map((code) => getTagData(code))
        .filter((v) => v !== false) as IApplicationData[],
    );
  }, [defaultValue, getTagData]);

  useEffect(() => {
    onChange(value.map(({ id }) => ({ id })));
  }, [value, onChange]);

  return (
    <Autocomplete
      value={value}
      onChange={(_, value) => setValue(value)}
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
          label={t('application:_')}
          helperText={error?.message ?? ' '}
          disabled={disabled}
          {...overrides?.TextFieldProps}
        />
      )}
      renderOption={(props, option) => (
        <ListItem dense {...props}>
          <ApplicationListItemInner option={option} />
        </ListItem>
      )}
      {...overrides?.AutoCompleteProps}
    />
  );
};

const ApplicationListItemInner = ({
  overrides,
  option,
}: OverridesProps<{
  ListItemTextProps?: ListItemTextProps;
}> & {
  option: IApplicationData;
}) => {
  const {
    data: { providerName },
  } = useDashboardUser(option.providerId);
  return (
    <>
      <ListItemText
        primary={option.name}
        primaryTypographyProps={{
          noWrap: true,
          textOverflow: 'ellipsis',
        }}
        secondary={providerName}
        secondaryTypographyProps={{
          noWrap: true,
          textOverflow: 'ellipsis',
        }}
        {...overrides?.ListItemTextProps}
      />
      <ListItemSecondaryAction>
        <ApplicationStatusChip status={option.status} />
      </ListItemSecondaryAction>
    </>
  );
};
