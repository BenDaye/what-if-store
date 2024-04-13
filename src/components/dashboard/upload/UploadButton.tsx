import { OverridesProps } from '@/types/overrides';
import { NOOPAsync } from '@/utils/noop';
import { AddBox as CreateIcon } from '@mui/icons-material';
import { Button, ButtonProps } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useBoolean } from 'usehooks-ts';
import { UploadDialog } from './UploadDialog';

type UploadButtonProps = OverridesProps<{
  ButtonProps?: ButtonProps;
}> & {
  onClose?: () => void;
};

export const UploadButton = ({
  overrides,
  onClose = NOOPAsync,
}: UploadButtonProps) => {
  const { t: tCommon } = useTranslation('common');
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
        {tCommon('Create')}
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
