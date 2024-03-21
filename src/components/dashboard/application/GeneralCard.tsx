import {
  useDashboardApplication,
  useDashboardApplicationTags,
  useDashboardUser,
  useNotice,
} from '@/hooks';
import { ApplicationUpdateInputSchema, IdSchema } from '@/server/schemas';
import {
  ILocaleData,
  getLocaleData,
  getLocaleDataList,
} from '@/utils/getLocaleList';
import { RouterOutput, trpc } from '@/utils/trpc';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  AutocompleteProps,
  Box,
  Button,
  Card,
  CardActions,
  CardActionsProps,
  CardContent,
  CardContentProps,
  CardHeader,
  CardHeaderProps,
  CardProps,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
  TextFieldProps,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ApplicationCategory } from '@prisma/client';
import {
  ICountryData,
  TCountryCode,
  getCountryData,
  getCountryDataList,
} from 'countries-list';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import {
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
  useForm,
} from 'react-hook-form';

type GeneralCardProps = {
  applicationId: IdSchema;
  overrides?: {
    CardProps?: CardProps;
    CardHeaderProps?: CardHeaderProps;
    CardContentProps?: CardContentProps;
    CardActionsProps?: CardActionsProps;
  };
};

export const GeneralCard = ({ applicationId, overrides }: GeneralCardProps) => {
  const { name, provider, data, description, category, website, github } =
    useDashboardApplication(applicationId);
  return (
    <Card sx={{ flexGrow: 1 }} {...overrides?.CardProps}>
      <CardContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        {...overrides?.CardContentProps}
      >
        <GeneralSectionCard
          applicationId={applicationId}
          defaultValues={{
            id: applicationId,
            name,
            description,
            category,
            website,
            github,
          }}
        />
        <ExtraSectionCard
          applicationId={applicationId}
          defaultValues={{
            id: applicationId,
            countries: data?.countries,
            locales: data?.Information?.locales,
            tags: data?.Tags,
          }}
        />
        {provider?.id && <UserSectionCard userId={provider.id} />}
      </CardContent>
    </Card>
  );
};

type GeneralSectionCardProps = GeneralCardProps & {
  defaultValues?: ApplicationUpdateInputSchema;
  applicationId?: IdSchema;
};

const GeneralSectionCard = ({ defaultValues }: GeneralSectionCardProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tApplication } = useTranslation('application', {
    keyPrefix: 'General',
  });
  const { t: tApplicationCategory } = useTranslation('application', {
    keyPrefix: 'Category',
  });
  const { handleSubmit, reset, control, formState } =
    useForm<ApplicationUpdateInputSchema>({
      defaultValues,
      mode: 'all',
    });

  useEffect(() => {
    if (!defaultValues) return;
    reset(defaultValues, { keepDefaultValues: false });
  }, [defaultValues, reset]);

  const { showSuccess, showError } = useNotice();
  const { mutateAsync: update, isPending } =
    trpc.protectedDashboardApplication.updateById.useMutation({
      onError: (err) => showError(err.message),
      onSuccess: () => showSuccess(tCommon('Updated', 'Updated')),
    });

  const onSubmit = async (data: ApplicationUpdateInputSchema) =>
    await update(data).catch(() => null);

  useEffect(() => {
    if (!window) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (formState.isDirty) {
        event.preventDefault();
        event.returnValue = tCommon(
          'UnsavedFormAlert',
          'Unsaved changes will be lost.',
        );
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formState, tCommon]);

  return (
    <Card
      variant="outlined"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        borderColor: formState.isDirty ? 'primary.main' : 'divider',
      }}
    >
      <CardHeader title={tApplication('_', 'General')} />
      <CardContent>
        <Grid container spacing={1}>
          <Grid md={12} xl={6}>
            <Controller
              control={control}
              name="name"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={tApplication('Name', 'Name')}
                  placeholder={tApplication('Name', 'Name')}
                  required
                  helperText={error?.message ?? ' '}
                  disabled={isPending}
                />
              )}
            />
          </Grid>
          <Grid md={12} xl={6}>
            <Controller
              control={control}
              name="category"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={tApplication('Category', 'Category')}
                  placeholder={tApplication('Category', 'Category')}
                  required
                  helperText={error?.message ?? ' '}
                  disabled={isPending}
                  select
                >
                  {Object.values(ApplicationCategory).map((category) => (
                    <MenuItem key={category} value={category}>
                      {tApplicationCategory(category, category)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid xs={12}>
            <Controller
              control={control}
              name="description"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={tApplication('Description', 'Description')}
                  placeholder={tApplication('Description', 'Description')}
                  required
                  helperText={error?.message ?? ' '}
                  disabled={isPending}
                  multiline
                  minRows={4}
                  maxRows={8}
                />
              )}
            />
          </Grid>
          <Grid md={12} xl={6}>
            <Controller
              control={control}
              name="website"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={tApplication('Website', 'Home Page')}
                  placeholder={tApplication('Website', 'Home Page')}
                  helperText={error?.message ?? ' '}
                  disabled={isPending}
                />
              )}
            />
          </Grid>
          <Grid md={12} xl={6}>
            <Controller
              control={control}
              name="github"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextField
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!error}
                  label={tApplication('Github', 'Github')}
                  placeholder={tApplication('Github', 'Github')}
                  helperText={error?.message ?? ' '}
                  disabled={isPending}
                />
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Box flexGrow={1} />
        <Button
          size="small"
          color="error"
          onClick={() => reset(defaultValues, { keepDefaultValues: false })}
          disabled={isPending || !formState.isDirty}
        >
          {tCommon('Reset', 'Reset')}
        </Button>
        <LoadingButton
          size="small"
          color="primary"
          type="submit"
          disabled={!formState.isDirty}
          loading={isPending}
        >
          {tCommon('Submit', 'Submit')}
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

type UserSectionCardProps = {
  userId: IdSchema;
};

const UserSectionCard = ({ userId }: UserSectionCardProps) => {
  const { push } = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tApplication } = useTranslation('application', {
    keyPrefix: 'General',
  });
  const { t: tUser } = useTranslation('user', {
    keyPrefix: 'General',
  });
  const { t: tProvider } = useTranslation('provider', {
    keyPrefix: 'General',
  });
  const { nickname, provider } = useDashboardUser(userId);
  return (
    <Card variant="outlined">
      <CardHeader title={tApplication('User', 'User General')} />
      <CardContent>
        <Grid container spacing={1}>
          <Grid md={12} xl>
            <TextField
              value={nickname}
              label={tUser('Name', 'User Nickname')}
              placeholder={tUser('Name', 'User Nickname')}
              disabled
            />
          </Grid>
          {provider && (
            <Grid md={12} xl={6}>
              <TextField
                value={provider.name}
                label={tProvider('Name', 'Provider Name')}
                placeholder={tProvider('Name', 'Provider Name')}
                disabled
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
      <CardActions>
        <Box flexGrow={1} />
        <Button onClick={() => push(`/dashboard/user/${userId}`)}>
          {tCommon('View', 'View')}
        </Button>
      </CardActions>
    </Card>
  );
};

type ExtraSectionCardProps = GeneralCardProps & {
  defaultValues?: ApplicationUpdateInputSchema;
};

const ExtraSectionCard = ({ defaultValues }: ExtraSectionCardProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tApplication } = useTranslation('application', {
    keyPrefix: 'General',
  });
  const { handleSubmit, reset, control, formState, setValue } =
    useForm<ApplicationUpdateInputSchema>({
      defaultValues,
      mode: 'all',
    });

  useEffect(() => {
    if (!defaultValues) return;
    reset(defaultValues, { keepDefaultValues: false });
  }, [defaultValues, reset]);

  const { showSuccess, showError } = useNotice();
  const { mutateAsync: update, isPending } =
    trpc.protectedDashboardApplication.updateById.useMutation({
      onError: (err) => showError(err.message),
      onSuccess: () => showSuccess(tCommon('Updated', 'Updated')),
    });

  const onSubmit = async (data: ApplicationUpdateInputSchema) =>
    await update(data).catch(() => null);

  useEffect(() => {
    if (!window) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (formState.isDirty) {
        event.preventDefault();
        event.returnValue = tCommon(
          'UnsavedFormAlert',
          'Unsaved changes will be lost.',
        );
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [formState, tCommon]);

  return (
    <Card
      variant="outlined"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        borderColor: formState.isDirty ? 'primary.main' : 'divider',
      }}
    >
      <CardHeader title={tApplication('Extra', 'Extra')} />
      <CardContent>
        <Grid container spacing={1}>
          <Grid xs={12}>
            <CountriesAutoComplete
              onChange={(value) =>
                setValue('countries', value, { shouldDirty: true })
              }
              defaultValue={defaultValues?.countries}
              error={formState.errors.countries}
              disabled={isPending}
            />
            <Controller
              control={control}
              name="countries"
              render={() => <Box />}
            />
          </Grid>
          <Grid xs={12}>
            <LocalesAutoComplete
              onChange={(value) =>
                setValue('locales', value, { shouldDirty: true })
              }
              defaultValue={defaultValues?.locales}
              error={formState.errors.locales}
              disabled={isPending}
            />
            <Controller
              control={control}
              name="locales"
              render={() => <Box />}
            />
          </Grid>
          <Grid xs={12}>
            <TagsAutoComplete
              onChange={(value) =>
                setValue('tags', value, { shouldDirty: true })
              }
              defaultValue={defaultValues?.tags}
              error={formState.errors.tags}
              disabled={isPending}
            />
            <Controller control={control} name="tags" render={() => <Box />} />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Box flexGrow={1} />
        <Button
          size="small"
          color="error"
          onClick={() => reset(defaultValues, { keepDefaultValues: false })}
          disabled={isPending || !formState.isDirty}
        >
          {tCommon('Reset', 'Reset')}
        </Button>
        <LoadingButton
          size="small"
          color="primary"
          type="submit"
          disabled={!formState.isDirty}
          loading={isPending}
        >
          {tCommon('Submit', 'Submit')}
        </LoadingButton>
      </CardActions>
    </Card>
  );
};
type CountriesAutoCompleteProps = {
  overrides?: {
    AutoCompleteProps?: AutocompleteProps<ICountryData, true, false, false>;
    TextFieldProps?: TextFieldProps;
  };
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  error?: Merge<FieldError, (FieldError | undefined)[]>;
  disabled?: boolean;
};

const CountriesAutoComplete = ({
  defaultValue = [],
  onChange = () => null,
  overrides,
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

type LocalesAutoCompleteProps = {
  overrides?: {
    AutoCompleteProps?: AutocompleteProps<ILocaleData, true, false, false>;
    TextFieldProps?: TextFieldProps;
  };
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  error?: Merge<FieldError, (FieldError | undefined)[]>;
  disabled?: boolean;
};

const LocalesAutoComplete = ({
  defaultValue = [],
  onChange = () => null,
  overrides,
  error,
  disabled = false,
}: LocalesAutoCompleteProps) => {
  const { t: tApplication } = useTranslation('application', {
    keyPrefix: 'General',
  });

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
          label={tApplication('Locales', 'Locales')}
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

type ITagData =
  RouterOutput['protectedDashboardApplicationTag']['list']['items'][number];

type TagsAutoCompleteProps<
  AutocompleteValue = ITagData,
  DefaultValue = RouterOutput['protectedAppApplication']['getById']['Tags'],
  UpdateValue = ApplicationUpdateInputSchema['tags'],
> = {
  overrides?: {
    AutoCompleteProps?: AutocompleteProps<
      AutocompleteValue,
      true,
      false,
      false
    >;
    TextFieldProps?: TextFieldProps;
  };
  defaultValue?: DefaultValue;
  onChange?: (value: UpdateValue) => void;
  error?: Merge<
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
  >;
  disabled?: boolean;
};

const TagsAutoComplete = ({
  defaultValue = [],
  onChange = () => null,
  overrides,
  error,
  disabled = false,
}: TagsAutoCompleteProps) => {
  const { t: tApplication } = useTranslation('application', {
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
          label={tApplication('Tags', 'Tags')}
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
