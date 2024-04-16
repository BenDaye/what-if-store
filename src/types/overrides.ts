import { ApplicationListInputSchema } from '@/server/schemas';
import {
  AppBarProps,
  AutocompleteProps,
  AvatarProps,
  ButtonProps,
  CardActionAreaProps,
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
  IconButtonProps,
  ListItemAvatarProps,
  ListItemButtonProps,
  ListItemIconProps,
  ListItemProps,
  ListItemSecondaryActionProps,
  ListItemTextProps,
  ListProps,
  ListSubheaderProps,
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
  CardActionAreaProps?: CardActionAreaProps;
}>;

export type OverridesListProps = OverridesProps<{
  ListProps?: ListProps;
  ListItemProps?: ListItemProps;
  ListItemButtonProps?: ListItemButtonProps;
  ListItemTextProps?: ListItemTextProps;
  ListItemIconProps?: ListItemIconProps;
  ListItemSecondaryActionProps?: ListItemSecondaryActionProps;
  ListItemAvatarProps?: ListItemAvatarProps;
  ListSubheaderProps?: ListSubheaderProps;
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

export type OverridesButtonProps = OverridesProps<{
  ButtonProps?: ButtonProps;
}>;

export type OverridesIconButtonProps = OverridesProps<{
  IconButtonProps?: IconButtonProps;
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
  RouterInput = ApplicationListInputSchema,
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
  routerInput?: RouterInput;
};
