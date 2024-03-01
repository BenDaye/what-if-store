import { SessionMenuItem, SettingsIconButton } from '@/components/common';
import { AuthRole } from '@prisma/client';
import { useBoolean } from 'usehooks-ts';
import { AppUserUpdateProfileDialog } from '../user/UpdateProfileDialog';

export const AppSettingsIconButton = () => {
  const {
    value: updateProfileDialogVisible,
    setTrue: openUpdateProfileDialog,
    setFalse: closeUpdateProfileDialog,
  } = useBoolean(false);
  return (
    <SettingsIconButton
      enableCommonMenuItems
      prependMenuItems={[
        <SessionMenuItem
          key="session-menu-item-update-profile"
          role={AuthRole.USER}
          onClick={openUpdateProfileDialog}
        />,
      ]}
    >
      <AppUserUpdateProfileDialog
        open={updateProfileDialogVisible}
        onClose={() => closeUpdateProfileDialog()}
        fullWidth
        maxWidth="xs"
      />
    </SettingsIconButton>
  );
};
