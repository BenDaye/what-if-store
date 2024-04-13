import {
  AppBarProps,
  AutocompleteProps,
  AvatarProps,
  CardActionsProps,
  CardContentProps,
  CardHeaderProps,
  CardMediaProps,
  CardProps,
  DialogActionsProps,
  DialogContentProps,
  DialogProps,
  DialogTitleProps,
  DrawerProps,
  ListItemAvatarProps,
  ListItemIconProps,
  ListItemTextProps,
  MenuItemProps,
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

export type OverridesDialogProps = OverridesProps<{
  DialogTitleProps?: DialogTitleProps;
  DialogContentProps?: DialogContentProps;
  DialogActionsProps?: DialogActionsProps;
  AppBarProps?: AppBarProps;
}> & {
  DialogProps: DialogProps;
};

export type OverridesDrawerProps = OverridesProps<{
  DrawerProps?: DrawerProps;
}>;

export type OverridesMenuItemProps = OverridesProps<{
  MenuItemProps?: MenuItemProps;
  ListItemIconProps?: ListItemIconProps;
  ListItemTextProps?: ListItemTextProps;
  ListItemAvatarProps?: ListItemAvatarProps;
  AvatarProps?: AvatarProps;
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
