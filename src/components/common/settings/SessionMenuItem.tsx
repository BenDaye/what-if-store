import { useAuth } from '@/hooks';
import { NOOP } from '@/utils/noop';
import { Avatar, ListItemAvatar, ListItemText, MenuItem } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

type SessionMenuItemProps = {
  onClick?: () => void;
};

export const SessionMenuItem = ({ onClick = NOOP }: SessionMenuItemProps) => {
  const { t: tAuth } = useTranslation('auth');
  const { data: session, status } = useSession();
  const { signIn } = useAuth();

  return (
    <MenuItem
      sx={{ mb: 1 }}
      selected
      onClick={() => {
        if (status !== 'authenticated') {
          signIn();
          return;
        }
        onClick();
      }}
    >
      <ListItemAvatar>
        <Avatar
          variant="rounded"
          sx={{
            height: 32,
            width: 32,
            bgcolor: status !== 'authenticated' ? undefined : 'primary.main',
            fontSize: (theme) => theme.typography.body2.fontSize,
            fontWeight: 700,
          }}
        >
          {session?.user?.username?.[0] ?? ''}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          status !== 'authenticated'
            ? tAuth('Unauthenticated')
            : session?.user?.name ?? ''
        }
        primaryTypographyProps={{
          color: status !== 'authenticated' ? 'text.disabled' : 'primary.light',
          noWrap: true,
          textOverflow: 'ellipsis',
        }}
      />
    </MenuItem>
  );
};
