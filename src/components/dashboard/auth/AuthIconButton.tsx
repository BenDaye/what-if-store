import {
  AuthIconButton,
  SessionMenuItem,
  SignOutMenuItem,
} from '@/components/common';
import { useSession } from 'next-auth/react';
import { useBoolean } from 'usehooks-ts';
import { DashboardAuthUpdateProfileDialog } from './UpdateProfileDialog';

export const DashboardAuthIconButton = () => {
  const { status } = useSession();

  const {
    value: updateProfileDialogVisible,
    setTrue: openUpdateProfileDialog,
    setFalse: closeUpdateProfileDialog,
  } = useBoolean(false);

  return (
    <AuthIconButton
      MenuItems={[
        <SessionMenuItem
          key="session-menu-item-update-profile"
          overrides={{
            MenuItemProps: {
              onClick: openUpdateProfileDialog,
            },
          }}
        />,
        ...(status === 'authenticated'
          ? [<SignOutMenuItem key="session-menu-item-logout" />]
          : []),
      ]}
    >
      <DashboardAuthUpdateProfileDialog
        DialogProps={{
          open: updateProfileDialogVisible,
          onClose: closeUpdateProfileDialog,
        }}
      />
    </AuthIconButton>
  );
};
