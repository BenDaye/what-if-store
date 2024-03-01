import { useAuth } from '@/hooks';
import { NOOP } from '@/utils/noop';
import { Avatar, ListItemAvatar, ListItemText, MenuItem } from '@mui/material';
import { AuthRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

type SessionMenuItemProps = {
  role?: AuthRole;
  onClick?: () => void;
};

export const SessionMenuItem = ({
  role = AuthRole.USER,
  onClick = NOOP,
}: SessionMenuItemProps) => {
  const { t: tAuth } = useTranslation('auth');
  const { data: session, status } = useSession();
  const unauthenticated = useMemo(
    () => status !== 'authenticated' || session.user?.role !== role,
    [session, status, role],
  );
  const { signIn } = useAuth();

  return (
    <MenuItem
      sx={{ mb: 1 }}
      selected
      onClick={() => {
        if (unauthenticated) {
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
            bgcolor: unauthenticated ? undefined : 'primary.main',
            fontSize: (theme) => theme.typography.body2.fontSize,
            fontWeight: 700,
          }}
        >
          {session?.user?.username?.[0] ?? ''}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          unauthenticated ? tAuth('Unauthenticated') : session?.user?.name ?? ''
        }
        primaryTypographyProps={{
          color: unauthenticated ? 'text.disabled' : 'primary.light',
          noWrap: true,
          textOverflow: 'ellipsis',
        }}
      />
    </MenuItem>
  );
};
