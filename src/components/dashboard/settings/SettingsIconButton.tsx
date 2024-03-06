import { SessionMenuItem, SettingsIconButton } from '@/components/common';
import { useBoolean } from 'usehooks-ts';
import { DashboardAuthUpdateProfileDialog } from '../auth/UpdateProfileDialog';

export const DashboardSettingsIconButton = () => {
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
      <DashboardAuthUpdateProfileDialog
        open={updateProfileDialogVisible}
        onClose={() => closeUpdateProfileDialog()}
        fullWidth
        maxWidth="xs"
      />
    </SettingsIconButton>
  );
};
