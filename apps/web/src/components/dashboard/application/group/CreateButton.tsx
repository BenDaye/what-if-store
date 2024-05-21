import type { OverridesButtonProps } from '@/types/overrides';
import { AddBox as CreateIcon } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useBoolean } from 'usehooks-ts';
import { ApplicationGroupDialog } from './Dialog';

export const ApplicationGroupCreateButton = ({ overrides }: OverridesButtonProps) => {
  const { t } = useTranslation();
  const {
    value: groupDialogVisible,
    setTrue: openGroupDialog,
    setFalse: closeGroupDialog,
  } = useBoolean(false);
  return (
    <>
      <Button onClick={openGroupDialog} startIcon={<CreateIcon />} {...overrides?.ButtonProps}>
        {t('common:Create')}
      </Button>
      <ApplicationGroupDialog
        DialogProps={{
          open: groupDialogVisible,
          onClose: closeGroupDialog,
        }}
        mutationType="create"
      />
    </>
  );
};
