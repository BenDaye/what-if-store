import {
  AutocompleteProps,
  CardActionsProps,
  CardContentProps,
  CardHeaderProps,
  CardMediaProps,
  CardProps,
  TextFieldProps,
} from '@mui/material';
import { FieldError, Merge } from 'react-hook-form';

export type OverridesProps<T = any> = {
  overrides?: T;
};

export type OverridesCardProps = OverridesProps<{
  CardProps?: CardProps;
  CardHeaderProps?: CardHeaderProps;
  CardContentProps?: CardContentProps;
  CardActionsProps?: CardActionsProps;
  CardMediaProps?: CardMediaProps;
}>;

export type MultipleAutoCompleteProps<
  AutoCompleteValueType = string,
  ValueType = string[],
  ErrorType = Merge<FieldError, (FieldError | undefined)[]>,
> = OverridesProps<{
  AutoCompleteProps?: AutocompleteProps<
    AutoCompleteValueType,
    true,
    false,
    false
  >;
  TextFieldProps?: TextFieldProps;
}> & {
  defaultValue?: ValueType;
  onChange?: (value: ValueType) => void;
  error?: ErrorType;
  disabled?: boolean;
};
