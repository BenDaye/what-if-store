import { SessionMenuItem, SettingsIconButton } from '@/components/common';
import { useBoolean } from 'usehooks-ts';
import { AppAuthUpdateProfileDialog } from '../auth/UpdateProfileDialog';

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
          onClick={openUpdateProfileDialog}
        />,
      ]}
    >
      <AppAuthUpdateProfileDialog
        open={updateProfileDialogVisible}
        onClose={() => closeUpdateProfileDialog()}
        fullWidth
        maxWidth="xs"
      />
    </SettingsIconButton>
  );
};
