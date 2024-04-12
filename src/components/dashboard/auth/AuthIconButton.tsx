import { AuthIconButton, SessionMenuItem } from '@/components/common';
import { useAuth } from '@/hooks';
import { ListItemText, MenuItem } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useBoolean } from 'usehooks-ts';
import { DashboardUserUpdateProfileDialog } from '../user';

export const DashboardAuthIconButton = () => {
  const { t: tAuth } = useTranslation('auth');
  const {
    value: updateProfileDialogVisible,
    setTrue: openUpdateProfileDialog,
    setFalse: closeUpdateProfileDialog,
  } = useBoolean(false);
  const { status } = useSession();
  const { signOut } = useAuth();

  return (
    <AuthIconButton
      MenuItems={[
        <SessionMenuItem
          key="session-menu-item-update-profile"
          onClick={openUpdateProfileDialog}
        />,
        <MenuItem
          key="session-menu-item-logout"
          disabled={status !== 'authenticated'}
          onClick={() => signOut()}
          dense
        >
          <ListItemText
            primary={tAuth('SignOut._')}
            primaryTypographyProps={{
              color:
                status !== 'authenticated' ? 'text.disabled' : 'text.secondary',
              noWrap: true,
              textOverflow: 'ellipsis',
            }}
          />
        </MenuItem>,
      ]}
    >
      <DashboardUserUpdateProfileDialog
        open={updateProfileDialogVisible}
        onClose={() => closeUpdateProfileDialog()}
        fullWidth
        maxWidth="xs"
      />
    </AuthIconButton>
  );
};
