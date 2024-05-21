import type { OverridesProps } from '@/types/overrides';
import { NOOPAsync } from '@/utils/noop';
import { AddBox as CreateIcon } from '@mui/icons-material';
import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useBoolean } from 'usehooks-ts';
import { UploadDialog } from './UploadDialog';

type UploadButtonProps = OverridesProps<{
  ButtonProps?: ButtonProps;
}> & {
  onClose?: () => void;
};

export const UploadButton = ({ overrides, onClose = NOOPAsync }: UploadButtonProps) => {
  const { t } = useTranslation();
  const {
    value: uploadDialogVisible,
    setTrue: openUploadDialog,
    setFalse: closeUploadDialog,
  } = useBoolean(false);

  return (
    <>
      <Button
        startIcon={<CreateIcon />}
        onClick={() => openUploadDialog()}
        disabled={uploadDialogVisible}
        {...overrides?.ButtonProps}
      >
        {t('common:Create')}
      </Button>
      <UploadDialog
        open={uploadDialogVisible}
        onClose={() => {
          closeUploadDialog();
          onClose();
        }}
      />
    </>
  );
};
