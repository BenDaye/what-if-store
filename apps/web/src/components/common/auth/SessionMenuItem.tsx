import { FallbackString } from '@/constants/common';
import { useAuth } from '@/hooks';
import type { OverridesMenuItemProps } from '@/types/overrides';
import { Avatar, ListItemAvatar, ListItemText, MenuItem } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

type SessionMenuItemProps = OverridesMenuItemProps;

export const SessionMenuItem = ({ overrides }: SessionMenuItemProps) => {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const { signIn } = useAuth();

  return (
    <MenuItem
      sx={{ mb: 1 }}
      selected
      {...overrides?.MenuItemProps}
      onClick={(ev) => {
        if (status !== 'authenticated') {
          signIn();
          return;
        }
        overrides?.MenuItemProps?.onClick?.(ev);
      }}
    >
      <ListItemAvatar {...overrides?.ListItemAvatarProps}>
        <Avatar
          variant="rounded"
          sx={{
            height: 32,
            width: 32,
            bgcolor: status !== 'authenticated' ? undefined : 'primary.main',
            fontSize: (theme) => theme.typography.body2.fontSize,
            fontWeight: 700,
          }}
          src={session?.user?.avatar || undefined}
          {...overrides?.AvatarProps}
        >
          {session?.user?.nickname?.charAt(0) ?? FallbackString}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          status !== 'authenticated' ? t('auth:Unauthenticated') : session?.user?.nickname ?? FallbackString
        }
        primaryTypographyProps={{
          color: status !== 'authenticated' ? 'text.disabled' : 'primary.light',
          noWrap: true,
          textOverflow: 'ellipsis',
        }}
        secondary={status !== 'authenticated' ? FallbackString : session?.user?.email ?? FallbackString}
        secondaryTypographyProps={{
          noWrap: true,
          textOverflow: 'ellipsis',
        }}
        {...overrides?.ListItemTextProps}
      />
    </MenuItem>
  );
};
