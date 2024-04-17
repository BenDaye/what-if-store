import { useAuth } from '@/hooks';
import { OverridesMenuItemProps } from '@/types/overrides';
import { Logout as SignOutIcon } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

export const SignOutMenuItem = ({ overrides }: OverridesMenuItemProps) => {
  const { t } = useTranslation();
  const { status } = useSession();
  const { signOut } = useAuth();
  return (
    <MenuItem onClick={() => signOut()} dense {...overrides?.MenuItemProps}>
      <ListItemIcon {...overrides?.ListItemIconProps}>
        <SignOutIcon />
      </ListItemIcon>
      <ListItemText
        primary={t('auth:SignOut._')}
        primaryTypographyProps={{
          color: status === 'authenticated' ? 'text.primary' : 'text.disabled',
          noWrap: true,
          textOverflow: 'ellipsis',
        }}
        {...overrides?.ListItemTextProps}
      />
    </MenuItem>
  );
};
