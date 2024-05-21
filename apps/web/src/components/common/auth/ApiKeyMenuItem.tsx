import type { OverridesMenuItemProps } from '@/types/overrides';
import { Key as ApiKeyIcon } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

export const ApiKeyMenuItem = ({ overrides }: OverridesMenuItemProps) => {
  const { t } = useTranslation();
  const { status } = useSession();
  return (
    <MenuItem dense {...overrides?.MenuItemProps}>
      <ListItemIcon {...overrides?.ListItemIconProps}>
        <ApiKeyIcon />
      </ListItemIcon>
      <ListItemText
        primary={t('auth:ApiKey._')}
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
