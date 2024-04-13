import { useAuth } from '@/hooks';
import { OverridesMenuItemProps } from '@/types/overrides';
import { Logout as SignOutIcon } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

export const SignOutMenuItem = ({ overrides }: OverridesMenuItemProps) => {
  const { t: tAuth } = useTranslation('auth');
  const { status } = useSession();
  const { signOut } = useAuth();
  return (
    <MenuItem onClick={() => signOut()} dense {...overrides?.MenuItemProps}>
      <ListItemIcon {...overrides?.ListItemIconProps}>
        <SignOutIcon />
      </ListItemIcon>
      <ListItemText
        primary={tAuth('SignOut._')}
        primaryTypographyProps={{
          color:
            status === 'authenticated' ? 'text.secondary' : 'text.disabled',
          noWrap: true,
          textOverflow: 'ellipsis',
        }}
        {...overrides?.ListItemTextProps}
      />
    </MenuItem>
  );
};
