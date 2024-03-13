import { SessionMenuItem, SettingsIconButton } from '@/components/common';
import { useBoolean } from 'usehooks-ts';
import { DashboardUserUpdateProfileDialog } from '../user';

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
      <DashboardUserUpdateProfileDialog
        open={updateProfileDialogVisible}
        onClose={() => closeUpdateProfileDialog()}
        fullWidth
        maxWidth="xs"
      />
    </SettingsIconButton>
  );
};
